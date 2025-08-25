"""
PostDisaster System - Converted from Jupyter Notebook
AI-powered disaster response analysis using CrewAI
"""

import os
import json
from dotenv import load_dotenv
import requests
from crewai import Agent, Task, Crew, LLM
from crewai.tools import tool
from crewai_tools import DOCXSearchTool
from langchain_openai import ChatOpenAI
from langchain.chat_models import ChatLiteLLM
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
import pathlib
import pyttsx3

# Load environment variables
load_dotenv()

# City mapping
city_map = {
    1: "Seabrook City",
    2: "Highland Park City",
    3: "Baytown City",
    4: "Ridgeview City",
    5: "Shoreline City"
}

# Tool functions
@tool
def resourcing(number: int) -> str:
    """
    Calculates the amount of resources needed based on the population.

    Args:
        number (int): The number of people.

    Returns:
        str: A string describing the required quantities of apples, bananas, and oranges.
    """
    return f"{number * 3} apples, {number * 2} bananas, and {number} oranges are needed for {number} people."

@tool
def helping(number: int) -> str:
    """
    Determines the number of resources dispatched for disaster response.

    Args:
        number (int): The total number of people hurt in the disaster.

    Returns:
        str: A detailed message indicating the resources allocated, 
             including helicopters, police personnel, and special forces units.
    """
    return f"{number//100} helicopters dispatched, {number//50} police dispatched and {number//200} special forces"

def run_disaster_analysis(selected_city_id: int):
    """
    Run the complete disaster analysis for a selected city
    
    Args:
        selected_city_id (int): City ID (1-5) from the city_map
        
    Returns:
        dict: Analysis results from all agents
    """
    
    print(f"Starting disaster analysis for: {city_map[selected_city_id]}")
    
    # Initialize LLM
    llm = LLM(
        model='gemini/gemini-2.0-flash',  
        temperature=0.5,
        api_key=os.getenv("GOOGLE_API_KEY"),  
    )

    # Initialize DOCXSearchTool
    tool = DOCXSearchTool(
        config=dict(
            llm=dict(
                provider="google",
                config=dict(
                    model='gemini/gemini-2.0-flash',
                    temperature=0.5,
                ),
            ),
            embedder=dict(
                provider="google",
                config=dict(
                    model="models/text-embedding-004",
                    task_type="retrieval_document",
                    title="Embeddings"
                ),
            ),
        )
    )

    # Use the city selected from satellite analysis
    Analysed_Site = city_map[selected_city_id]
    print(f"Analyzing disaster response for: {Analysed_Site}")

    # Create Agents
    data_collector = Agent(
        role="Document Searcher",
        goal=f'Collect All the data available about {Analysed_Site} city in DOCX files. For example(just for reference, read through document for actual data)',
        backstory="You're a proactive data collector agent who collects all the data available about the city in DOCX files. You will use the tool provided to search through documents and gather relevant information.",
        llm=llm,
        verbose=True,
        tools=[tool],
    )

    needs_analyst = Agent(
        role="Needs Analyser",
        goal=f"Based on the information available from data_collector agent, generate a professional grade News report for only {Analysed_Site} city about TOTAL POPULATION and Essential Needs for the city people",
        backstory="You're a News reporter and analyst who finds out the needs of population",
        llm=llm,
        verbose=True
    )

    help_dispatcher = Agent(
        role="Aid Dispatcher",
        goal=f"Based on that Number of People Hurt, Number of People Stuck and where they are stuck from the information gathered by data_collector about the city, generate a professional grade News report for only {Analysed_Site} city about number of helicopters dispatched, police dispatched, special forces dispatched using the tool you are provided with.",
        backstory="You're a proactive News report generator agent who provides the numbers of the help that is dispatched effectively to meet the needs of the number of people hurt due to disaster.",
        llm=llm,
        verbose=True,
        tools=[helping]
    )

    resource_allocator = Agent(
        role="Resources Allocator",
        goal=f"Based on that Number of Population in the input city information provided by data_collector for the city, generate a professional grade News report for only {Analysed_Site} city what is the population of city and use given tool to estimate amount of foods needed returned by the tool you are provided with",
        backstory="You're a proactive News report generator agent who generates information about resources that needs to be dispatched effectively to meet the needs of the population.",
        llm=llm,
        verbose=True,
        tools=[resourcing]
    )

    damage_analyser = Agent(
        role="Damage Analyser",
        goal=f"Based on the Damaged Infrastructure information collected by data_collector, generate report for only {Analysed_Site} city of the Damaged Infrastructure in the disaster-affected area for the input city and identify critical zones requiring immediate attention.",
        backstory="You're a proactive News report generator agent who generates information about disaster impacts to provide Infrastructure damage.",
        llm=llm,
        verbose=True
    )

    print("Agents created successfully!")

    # Create Tasks
    dataCollect_task = Task(
        description=f'Collect All the data available about {Analysed_Site} city in DOCX files. For example(just for reference, read through document for actual data), you will find docx file in "Cities.docx"',
        expected_output="A properly formatted JSON containing all collected data about the city including population, disaster information, casualties, and infrastructure damage",
        agent=data_collector,
    )

    needs_task = Task(
        description=f"Based on the information available from data_collector agent, generate a professional grade News report for only {Analysed_Site} city of what is the TOTAL POPULATION and Essential Needs for the city people",
        expected_output="A Professional grade News report of what is the Essential Needs for the city people within 30-40 words, so only include report related to TOTAL POPULATION and essential needs of the city people",
        agent=needs_analyst,
        context=[dataCollect_task]
    )

    dispatch_task = Task(
        description=f"Based on that Number of People Hurt, Number of People Stuck and where they are stuck from the information gathered by data_collector about the city, generate a professional grade News report for only {Analysed_Site} city about number of helicopters dispatched, police dispatched, special forces dispatched using the tool you are provided with.",
        expected_output="A Professional grade News report of information and telling that the number of help has been dispatched in 30-40 words, so only include report related to help dispatched",
        agent=help_dispatcher,
        context=[dataCollect_task]
    )

    resource_allocation_task = Task(
        description=f"Based on that Number of Population in the input city information provided by data_collector for the city, generate a professional grade News report for only {Analysed_Site} city of what is the population of city and use given tool to estimate amount of foods needed returned by the tool you are provided with.",
        expected_output="A Professional grade News report of the amount of resources needed in that area in 30-40 words, so only include report related to resources needed",
        agent=resource_allocator,
        context=[dataCollect_task]
    )

    damageAnalysis_task = Task(
        description=f"Based on the Damaged Infrastructure information collected by data_collector, generate report of the Damaged Infrastructure in the disaster-affected area for only {Analysed_Site} city and identify critical zones requiring immediate attention.",
        expected_output="A Professional grade News report on the extent of damage, including severity levels and affected zones in 30-40 words, so only include report related to damage analysis",
        agent=damage_analyser,
        context=[dataCollect_task]
    )

    # Create and run Crew
    crew = Crew(
        agents=[data_collector, needs_analyst, help_dispatcher, resource_allocator, damage_analyser],
        tasks=[dataCollect_task, needs_task, dispatch_task, resource_allocation_task, damageAnalysis_task],
        verbose=True
    )
    
    print("Tasks and crew set up successfully!")
    print("Starting CrewAI execution...")

    # Execute the crew
    result = crew.kickoff()
    
    # Process results
    agent_outputs = {}
    for i, task_output in enumerate(result.tasks_output):
        agent_outputs[f"Agent{i}"] = task_output.raw

    # Remove data collector output and rename agents
    agent_outputs.pop("Agent0", None)  # Remove the data collector's output if not needed
    
    # Rename agents for better readability
    final_outputs = {}
    if "Agent1" in agent_outputs:
        final_outputs['Needs Analyst Agent'] = agent_outputs['Agent1']
    if "Agent2" in agent_outputs:
        final_outputs['Help Dispatcher Agent'] = agent_outputs['Agent2']
    if "Agent3" in agent_outputs:
        final_outputs['Resource Allocator Agent'] = agent_outputs['Agent3']
    if "Agent4" in agent_outputs:
        final_outputs['Damage Analyser'] = agent_outputs['Agent4']

    print("CrewAI analysis completed successfully!")
    return final_outputs

def analyze_city_from_image_and_run_crew(image_path=None):
    """
    Complete workflow: Analyze image -> Get city -> Run CrewAI analysis

    Args:
        image_path (str): Path to city image (optional, uses default if None)

    Returns:
        dict: Complete analysis results
    """
    from satellite import analyze_city_image

    # Step 1: Analyze satellite image
    print("Step 1: Analyzing satellite image...")
    detected_city_number = analyze_city_image(image_path)

    if detected_city_number:
        print(f"Satellite analysis detected: {city_map[detected_city_number]} (City #{detected_city_number})")
        selected_city_id = detected_city_number
    else:
        print("Satellite analysis failed, falling back to default city (Seabrook City)")
        selected_city_id = 1  # Fallback to Seabrook City

    print(f"Selected city for analysis: {city_map[selected_city_id]}")

    # Step 2: Run CrewAI analysis
    print("\nStep 2: Running CrewAI disaster analysis...")
    crew_results = run_disaster_analysis(selected_city_id)

    # Step 3: Combine results
    complete_results = {
        "satellite_analysis": {
            "detected_city_id": selected_city_id,
            "detected_city_name": city_map[selected_city_id],
            "image_path": image_path
        },
        "disaster_analysis": crew_results,
        "status": "success"
    }

    return complete_results

# Test function
if __name__ == "__main__":
    print("Testing PostDisaster System...")
    
    # Test with default image (Baytown)
    results = analyze_city_from_image_and_run_crew()
    
    print("\n" + "="*60)
    print("FINAL RESULTS:")
    print("="*60)
    print(json.dumps(results, indent=2))