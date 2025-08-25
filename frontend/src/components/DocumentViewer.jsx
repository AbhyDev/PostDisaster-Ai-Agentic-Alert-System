import React, { useState } from 'react';
import { FileText, Download, X, ExternalLink } from 'lucide-react';

const DocumentViewer = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Cities.docx';
    link.download = 'Cities.docx';
    link.click();
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <>
      {/* Document Section */}
      <div className="card">
        <div className="section-header">
          <FileText size={24} />
          <h2 className="text-xl font-semibold">RAG Knowledge Base</h2>
        </div>
        
        <div className="document-container">
          <div className="document-info">
            <div className="document-icon">
              <FileText className="w-8 h-8" style={{ color: '#667eea' }} />
            </div>
            <div className="document-details">
              <h3 className="document-title">Cities.docx</h3>
              <p className="document-description">
                This document contains the knowledge base used by our RAG system for disaster analysis and city information.
              </p>
            </div>
          </div>
          
          <div className="document-actions">
            <button
              onClick={handlePreview}
              className="btn btn-secondary"
            >
              <ExternalLink size={16} />
              Preview
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-primary"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h3 className="modal-title">Cities.docx Preview</h3>
              <div className="modal-actions">
                <button
                  onClick={handleDownload}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={closePreview}
                  className="modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="modal-notice">
                <p>
                  <strong>Note:</strong> This is a Word document that contains the knowledge base for our RAG system. 
                  For the best viewing experience, please download the file and open it in Microsoft Word or a compatible application.
                </p>
              </div>
              
              {/* Document Preview Frame */}
              <div className="document-preview">
                <div className="document-preview-header">
                  <FileText size={20} style={{ color: '#667eea' }} />
                  <span className="document-preview-title">Cities.docx</span>
                </div>
                
                <div className="document-preview-content">
                  <div className="preview-placeholder">
                    <FileText size={64} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
                    <h4 className="preview-title">Document Preview</h4>
                    <p className="preview-description">
                      This Word document contains detailed information about cities and disaster response protocols 
                      used by our AI system for analysis.
                    </p>
                    <div className="preview-features">
                      <h5 className="features-title">Document Contents Include:</h5>
                      <ul className="features-list">
                        <li>• City profiles and geographical information</li>
                        <li>• Disaster response protocols and procedures</li>
                        <li>• Emergency contact information</li>
                        <li>• Resource allocation guidelines</li>
                        <li>• Historical disaster data and patterns</li>
                      </ul>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="btn btn-primary download-cta"
                    >
                      <Download size={20} />
                      Download Full Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentViewer;
