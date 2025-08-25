import google.generativeai as genai
from PIL import Image
import os

from dotenv import load_dotenv
import os
load_dotenv()

# City mapping - same as in PostDisaster_System.ipynb
city_map = {
    1: "Seabrook City",
    2: "Highland Park City", 
    3: "Baytown City",
    4: "Ridgeview City",
    5: "Shoreline City"
}

def get_city_number_from_name(city_name):
    """Convert city name to city number"""
    for number, name in city_map.items():
        if name.lower() in city_name.lower():
            return number
    return None

def detect_city_with_red_cross(image_path):
    """Analyze satellite image and return city number"""
    # Check if API key is available
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key or api_key == "your_google_api_key_here":
        print("Google API key not configured. Using mock analysis for Baytown.png")
        # Mock response for Baytown image
        if "Baytown" in image_path:
            return 3, "Baytown City"
        else:
            return 1, "Seabrook City"  # Default fallback
    
    # Real API analysis
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    image = Image.open(image_path)
    
    # List of valid cities for the prompt
    valid_cities = list(city_map.values())
    cities_str = ", ".join(valid_cities)
    
    prompt = f"""
    Analyze this satellite image and identify which city it represents.
    
    You must return ONLY ONE of these exact city names:
    {cities_str}
    
    Look for any text, labels, or identifying features in the image that indicate which city this is.
    If there's a red cross marker, pay attention to any city name near it.
    
    Return ONLY the city name from the list above. Do not include any other text or explanation.
    """
    
    response = model.generate_content([prompt, image])
    
    # Clean the response and get city number
    city_name = response.text.strip()
    city_number = get_city_number_from_name(city_name)
    
    return city_number, city_name

def analyze_city_image(image_path=None):
    """Main function to analyze city image and return city number"""
    # For now, use the hardcoded Baytown image path as requested
    if image_path is None:
        image_path = r"D:\All Projects\Site uploaded\PostDisaster-Ai-Agentic-Alert-System\Dummy Cities\Baytown.png"
    
    try:
        city_number, city_name = detect_city_with_red_cross(image_path)
        
        if city_number:
            print(f"Detected City: {city_name}")
            print(f"City Number: {city_number}")
            return city_number
        else:
            print(f"Could not match detected city '{city_name}' to valid city list")
            print("Valid cities are:", list(city_map.values()))
            return None
            
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return None

if __name__ == "__main__":
    # Test the function
    result = analyze_city_image()
    if result:
        print(f"\nReturning city number: {result}")
    else:
        print("\nFailed to detect city")