import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onImageSelect, selectedImage, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    onImageSelect(file);
  };

  const clearImage = () => {
    if (disabled) return;
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {selectedImage ? (
        <div className="selected-image">
          <div className="image-preview">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            {!disabled && (
              <button
                onClick={clearImage}
                className="remove-image-btn"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="image-info mt-4">
            <p className="text-sm text-gray-600">
              <strong>File:</strong> {selectedImage.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          style={{
            border: `2px dashed ${dragActive ? '#667eea' : '#e5e7eb'}`,
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: dragActive ? '#f0f4ff' : disabled ? '#f9fafb' : '#ffffff',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <div className="upload-content">
            <div className="upload-icon mb-4">
              {dragActive ? (
                <Upload size={48} color="#667eea" />
              ) : (
                <ImageIcon size={48} color="#9ca3af" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {dragActive ? 'Drop image here' : 'Upload Satellite Image'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop an image here, or click to select
            </p>
            <div className="upload-formats">
              <p className="text-sm text-gray-500">
                Supports: PNG, JPG, JPEG (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .image-upload {
          width: 100%;
        }

        .selected-image {
          position: relative;
        }

        .image-preview {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .upload-zone {
          transition: all 0.2s ease;
        }

        .upload-zone:hover:not(.disabled) {
          border-color: #667eea;
          background-color: #f0f4ff;
        }

        .upload-zone.drag-active {
          border-color: #667eea;
          background-color: #f0f4ff;
          transform: scale(1.02);
        }

        .upload-zone.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .upload-icon {
          display: flex;
          justify-content: center;
        }

        .remove-image-btn:hover {
          background: rgba(239, 68, 68, 1) !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;