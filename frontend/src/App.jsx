import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Satellite,
  Bot,
  Upload,
  Play,
  TestTube,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

import ImageUpload from './components/ImageUpload';
import CityGallery from './components/CityGallery';
import AnalysisResults from './components/AnalysisResults';
import { apiService, handleApiError } from './services/api';

function App() {
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [cities, setCities] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
    loadCities();
  }, []);

  const checkApiStatus = async () => {
    try {
      await apiService.getApiInfo();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('disconnected');
      setError('Cannot connect to API server. Please ensure the FastAPI server is running on http://localhost:8000');
    }
  };

  const loadCities = async () => {
    try {
      const response = await apiService.getCities();
      setCities(response.cities || []);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const clearResults = () => {
    setAnalysisResults(null);
    setError(null);
  };

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setSelectedCity(null);
    clearResults();
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedImage(null);
    clearResults();
  };

  const handleImageAnalysis = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    clearResults();

    try {
      const result = await apiService.analyzeImage(selectedImage);
      setAnalysisResults({
        status: result.success ? 'success' : 'warning',
        satellite_analysis: result,
        disaster_analysis: null
      });
    } catch (error) {
      const errorInfo = handleApiError(error);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteAnalysis = async () => {
    if (!selectedImage && !selectedCity) {
      setError('Please select an image or city first');
      return;
    }

    setIsLoading(true);
    setError(null);
    clearResults();
    setUploadProgress(0);

    try {
      let result;
      
      if (selectedImage) {
        // Complete analysis with uploaded image
        result = await apiService.completeAnalysis(
          selectedImage,
          (progress) => setUploadProgress(progress)
        );
      } else if (selectedCity) {
        // Analysis for selected city
        const cityResult = await apiService.analyzeCityById(selectedCity.id);
        result = {
          status: 'success',
          satellite_analysis: {
            detected_city_name: selectedCity.name,
            detected_city_id: selectedCity.id,
            success: true,
            message: `Analysis for ${selectedCity.name} (manually selected)`
          },
          disaster_analysis: cityResult
        };
      }

      setAnalysisResults(result);
    } catch (error) {
      const errorInfo = handleApiError(error);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleTestAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    clearResults();

    try {
      const result = await apiService.testAnalysis();
      setAnalysisResults(result);
    } catch (error) {
      const errorInfo = handleApiError(error);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    setApiStatus('checking');
    checkApiStatus();
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="app-title">
                🚨 PostDisaster AI System
              </h1>
              <p className="app-subtitle">
                AI-Powered Disaster Response Analysis using Satellite Imagery
              </p>
            </div>
            
            <div className="status-section">
              <div className={`api-status ${apiStatus}`}>
                {apiStatus === 'connected' && <Wifi size={20} />}
                {apiStatus === 'disconnected' && <WifiOff size={20} />}
                {apiStatus === 'checking' && <RefreshCw size={20} className="spin" />}
                <span>
                  {apiStatus === 'connected' && 'API Connected'}
                  {apiStatus === 'disconnected' && 'API Disconnected'}
                  {apiStatus === 'checking' && 'Checking...'}
                </span>
                {apiStatus === 'disconnected' && (
                  <button onClick={retryConnection} className="retry-btn">
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>



        {/* Error Display */}
        {error && (
          <div className="alert alert-error">
            <AlertTriangle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {/* Main Content */}
        {apiStatus === 'connected' ? (
          <div className="main-content">
            {/* Upload Section */}
            <div className="card">
              <div className="section-header">
                <Upload size={24} />
                <h2 className="text-xl font-semibold">Upload Satellite Image</h2>
              </div>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                disabled={isLoading}
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>

            {/* OR Divider */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* City Selection */}
            <div className="card">
              <CityGallery
                onCitySelect={handleCitySelect}
                selectedCity={selectedCity}
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="actions-section">
              <div className="actions-grid">
                <button
                  onClick={handleImageAnalysis}
                  disabled={!selectedImage || isLoading}
                  className="btn btn-secondary"
                >
                  <Satellite size={20} />
                  Analyze Image Only
                </button>

                <button
                  onClick={handleCompleteAnalysis}
                  disabled={(!selectedImage && !selectedCity) || isLoading}
                  className="btn btn-primary"
                >
                  <Bot size={20} />
                  {isLoading ? 'Analyzing...' : 'Complete Analysis'}
                </button>

                <button
                  onClick={handleTestAnalysis}
                  disabled={isLoading}
                  className="btn btn-warning"
                >
                  <TestTube size={20} />
                  Test Analysis
                </button>
              </div>

              {(selectedImage || selectedCity) && (
                <div className="selection-info">
                  {selectedImage && (
                    <p>📸 Selected Image: {selectedImage.name}</p>
                  )}
                  {selectedCity && (
                    <p>🏙️ Selected City: {selectedCity.name}</p>
                  )}
                </div>
              )}
            </div>

            {/* Results Section */}
            {(analysisResults || isLoading) && (
              <AnalysisResults
                results={analysisResults}
                isLoading={isLoading}
              />
            )}
          </div>
        ) : (
          <div className="connection-error">
            <div className="card text-center">
              <WifiOff size={48} className="error-icon" />
              <h2>Cannot Connect to API</h2>
              <p>Please ensure the FastAPI server is running on http://localhost:8000</p>
              <button onClick={retryConnection} className="btn btn-primary">
                <RefreshCw size={20} />
                Retry Connection
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .app-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .app-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .app-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
        }

        .api-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .api-status.connected {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .api-status.disconnected {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .api-status.checking {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .retry-btn {
          background: none;
          border: none;
          color: inherit;
          text-decoration: underline;
          cursor: pointer;
          font-size: 12px;
          margin-left: 8px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }



        .rag-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .rag-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .rag-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #667eea;
        }

        .rag-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .document-info p {
          margin: 8px 0;
          color: #374151;
        }

        .document-info strong {
          color: #1f2937;
        }

        .rag-process {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .process-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .step-number {
          background: #667eea;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-content {
          color: #374151;
          line-height: 1.5;
        }

        .step-content strong {
          color: #1f2937;
        }

        .agents-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .agent-item {
          padding: 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          color: #374151;
        }

        .agent-item strong {
          color: #667eea;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 24px 0;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        .divider span {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }

        .actions-section {
          margin: 24px 0;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .selection-info {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 12px 16px;
          color: white;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-bar {
          position: relative;
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: 16px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: -24px;
          right: 0;
          font-size: 12px;
          color: #6b7280;
        }

        .connection-error {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .error-icon {
          color: #ef4444;
          margin-bottom: 16px;
        }

        .close-btn {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          margin-left: auto;
        }

        @media (max-width: 768px) {
          .app-title {
            font-size: 2rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .rag-process {
            gap: 12px;
          }

          .process-step {
            flex-direction: column;
            gap: 8px;
          }

          .step-number {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default App;