import React from 'react';
import { MapPin, Eye } from 'lucide-react';

const CityGallery = ({ onCitySelect, selectedCity, disabled = false }) => {
  const cities = [
    { id: 1, name: 'Seabrook City', image: '/images/Seabrook.png' },
    { id: 2, name: 'Highland Park City', image: '/images/Highland Park.png' },
    { id: 3, name: 'Baytown City', image: '/images/Baytown.png' },
    { id: 4, name: 'Ridgeview City', image: '/images/Ridgeview.png' },
    { id: 5, name: 'Shoreline City', image: '/images/Shoreline.png' },
  ];

  const handleCityClick = (city) => {
    if (disabled) return;
    onCitySelect(city);
  };

  return (
    <div className="city-gallery">
      <div className="gallery-header mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MapPin size={24} />
          Available Cities
        </h3>
        <p className="text-gray-600 mt-2">
          Select a city to analyze or upload your own satellite image
        </p>
      </div>

      <div className="cities-grid">
        {cities.map((city) => (
          <div
            key={city.id}
            className={`city-card ${selectedCity?.id === city.id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => handleCityClick(city)}
          >
            <div className="city-image">
              <img
                src={city.image}
                alt={city.name}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA2NUw5MyA3MUwxMDUgNTlMMTE3IDcxTDEyMyA2NVY4NUg4N1Y2NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4OCIgeT0iNjMiPgo8cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOUM1IDEwLjc0IDUuNSAxMi4zNyA2LjM5IDEzLjc2TDEyIDIyTDE3LjYxIDEzLjc2QzE4LjUgMTIuMzcgMTkgMTAuNzQgMTkgOUMxOSA1LjEzIDE1Ljg3IDIgMTIgMlpNMTIgMTEuNUM5Ljc5IDExLjUgOCA5LjcxIDggNy41QzggNS4yOSA5Ljc5IDMuNSAxMiAzLjVDMTQuMjEgMy41IDE2IDUuMjkgMTYgNy41QzE2IDkuNzEgMTQuMjEgMTEuNSAxMiAxMS41WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4KPC9zdmc+';
                }}
              />
              <div className="city-overlay">
                <Eye size={20} />
                <span>View Details</span>
              </div>
            </div>
            <div className="city-info">
              <h4 className="city-name">{city.name}</h4>
              <p className="city-id">City ID: {city.id}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .city-gallery {
          width: 100%;
        }

        .cities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .city-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .city-card:hover:not(.disabled) {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .city-card.selected {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .city-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .city-card.disabled:hover {
          transform: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-color: transparent;
        }

        .city-image {
          position: relative;
          height: 150px;
          overflow: hidden;
        }

        .city-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .city-card:hover:not(.disabled) .city-image img {
          transform: scale(1.05);
        }

        .city-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .city-card:hover:not(.disabled) .city-overlay {
          opacity: 1;
        }

        .city-overlay span {
          font-size: 14px;
          font-weight: 600;
        }

        .city-info {
          padding: 16px;
        }

        .city-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .city-id {
          font-size: 14px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .cities-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
          }

          .city-image {
            height: 120px;
          }

          .city-info {
            padding: 12px;
          }

          .city-name {
            font-size: 14px;
          }

          .city-id {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default CityGallery;