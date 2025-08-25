import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Users, 
  Truck, 
  Apple, 
  Building,
  Satellite,
  Bot,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AnalysisResults = ({ results, isLoading = false }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    satellite: true,
    disaster: true,
    raw: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <div className="analysis-results">
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <div>
              <h3>Analyzing your request...</h3>
              <p>This may take a few minutes as our AI agents work together</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={24} />;
      default:
        return <Info className="text-blue-500" size={24} />;
    }
  };

  const getAgentIcon = (agentName) => {
    if (agentName.includes('Data Collector')) return <Building size={20} />;
    if (agentName.includes('Needs Analyst')) return <Users size={20} />;
    if (agentName.includes('Help Dispatcher')) return <Truck size={20} />;
    if (agentName.includes('Resource Allocator')) return <Apple size={20} />;
    if (agentName.includes('Damage Analyser')) return <Building size={20} />;
    return <Bot size={20} />;
  };

  return (
    <div className="analysis-results">
      {/* Status Header */}
      <div className="card">
        <div className="result-header">
          {getStatusIcon(results.status)}
          <div>
            <h2 className="text-2xl font-bold">
              {results.status === 'success' ? 'Analysis Complete!' : 'Analysis Results'}
            </h2>
            <p className="text-gray-600">
              {results.status === 'success' 
                ? 'Your disaster response analysis has been completed successfully.'
                : 'Analysis completed with some issues.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Satellite Analysis Section */}
      {results.satellite_analysis && (
        <div className="card">
          <div 
            className="section-header"
            onClick={() => toggleSection('satellite')}
          >
            <div className="section-title">
              <Satellite size={24} />
              <h3 className="text-xl font-semibold">Satellite Image Analysis</h3>
            </div>
            {expandedSections.satellite ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.satellite && (
            <div className="section-content">
              <div className="satellite-info">
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Detected City:</strong>
                    <span>{results.satellite_analysis.detected_city_name || 'Unknown'}</span>
                  </div>
                  <div className="info-item">
                    <strong>City ID:</strong>
                    <span>{results.satellite_analysis.detected_city_id || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <strong>Analysis Status:</strong>
                    <span className={`status-badge ${results.satellite_analysis.success ? 'success' : 'warning'}`}>
                      {results.satellite_analysis.success ? 'Success' : 'Fallback Mode'}
                    </span>
                  </div>
                </div>
                {results.satellite_analysis.message && (
                  <div className="analysis-message">
                    <p>{results.satellite_analysis.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disaster Analysis Section */}
      {results.disaster_analysis && (
        <div className="card">
          <div 
            className="section-header"
            onClick={() => toggleSection('disaster')}
          >
            <div className="section-title">
              <Bot size={24} />
              <h3 className="text-xl font-semibold">CrewAI Disaster Analysis</h3>
            </div>
            {expandedSections.disaster ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.disaster && (
            <div className="section-content">
              <div className="agents-results">
                {Object.entries(results.disaster_analysis).map(([agentName, output], index) => (
                  <div key={index} className="agent-result">
                    <div className="agent-header">
                      {getAgentIcon(agentName)}
                      <h4 className="agent-name">{agentName}</h4>
                    </div>
                    <div className="agent-output">
                      {typeof output === 'string' || typeof output === 'number' || typeof output === 'boolean' ? (
                        <p>{String(output)}</p>
                      ) : (
                        <pre className="raw-object">{(() => { try { return JSON.stringify(output, null, 2); } catch { return String(output); } })()}</pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Raw Data Section */}
      <div className="card">
        <div 
          className="section-header"
          onClick={() => toggleSection('raw')}
        >
          <div className="section-title">
            <Info size={24} />
            <h3 className="text-xl font-semibold">Raw Response Data</h3>
          </div>
          {expandedSections.raw ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.raw && (
          <div className="section-content">
            <pre className="raw-data">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .analysis-results {
          width: 100%;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }

        .section-header:hover {
          color: #667eea;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-content {
          margin-top: 16px;
        }

        .satellite-info {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item strong {
          color: #374151;
          font-size: 14px;
        }

        .info-item span {
          color: #1f2937;
          font-size: 16px;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.success {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.warning {
          background: #fef3c7;
          color: #92400e;
        }

        .analysis-message {
          padding: 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .agents-results {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .agent-result {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #667eea;
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .agent-name {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
        }

        .agent-output {
          color: #374151;
          line-height: 1.6;
        }

        .raw-object {
          background: #1f2937;
          color: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          font-size: 12px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.4;
          margin: 0;
        }

        .raw-data {
          background: #1f2937;
          color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 12px;
          line-height: 1.4;
          max-height: 400px;
          overflow-y: auto;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px;
          text-align: center;
        }

        .loading h3 {
          margin: 0 0 8px 0;
          color: #1f2937;
        }

        .loading p {
          margin: 0;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .agent-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisResults;