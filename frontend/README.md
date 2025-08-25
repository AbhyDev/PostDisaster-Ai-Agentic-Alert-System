# PostDisaster AI System - Frontend

A modern React frontend for the PostDisaster AI System that provides disaster response analysis using satellite imagery and CrewAI.

## 🚀 Features

- **🛰️ Satellite Image Analysis**: Upload images and get AI-powered city detection
- **🏙️ City Gallery**: Browse and select from available cities
- **🤖 CrewAI Integration**: Complete disaster response analysis with 5 specialized AI agents
- **📊 Real-time Results**: Interactive display of analysis results
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🔄 Live API Status**: Real-time connection status with the backend

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icons
- **CSS3** - Custom styling with modern features

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- FastAPI backend running on `http://localhost:8000`

## 🚀 Quick Start

### Option 1: Automatic Setup

**Windows:**
```bash
setup-frontend.bat
```

**Linux/Mac:**
```bash
chmod +x setup-frontend.sh
./setup-frontend.sh
```

### Option 2: Manual Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── images/           # City images
│   │   ├── Baytown.png
│   │   ├── Highland Park.png
│   │   ├── Ridgeview.png
│   │   ├── Seabrook.png
│   │   └── Shoreline.png
│   └── index.html
├── src/
│   ├── components/       # React components
│   │   ├── ImageUpload.jsx
│   │   ├── CityGallery.jsx
│   │   └── AnalysisResults.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── package.json
└── vite.config.js
```

## 🎯 How to Use

### 1. **Upload Image Analysis**
- Drag and drop a satellite image or click to select
- Click "Analyze Image Only" for city detection
- Click "Complete Analysis" for full CrewAI disaster analysis

### 2. **City Selection**
- Browse the city gallery
- Click on any city to select it
- Click "Complete Analysis" to run disaster analysis

### 3. **Test Mode**
- Click "Test Analysis" to run with default Baytown image
- Perfect for testing without uploading files

## 🔧 Configuration

### API Endpoint
The frontend connects to the FastAPI backend at `http://localhost:8000`. To change this:

1. Edit `src/services/api.js`
2. Update the `API_BASE_URL` constant

### Proxy Configuration
Vite is configured to proxy API requests. See `vite.config.js` for details.

## 📊 API Integration

The frontend integrates with these FastAPI endpoints:

- `GET /` - API status and information
- `GET /cities/` - Available cities list
- `POST /analyze-image/` - Image analysis only
- `GET /analyze-city/{id}` - City-specific analysis
- `POST /complete-analysis/` - Full workflow
- `GET /test-analysis/` - Test with default image

## 🎨 Components Overview

### **ImageUpload**
- Drag & drop file upload
- Image preview and validation
- Progress tracking for uploads

### **CityGallery**
- Grid display of available cities
- Interactive city selection
- Responsive design

### **AnalysisResults**
- Collapsible sections for different result types
- Satellite analysis display
- CrewAI agent results with icons
- Raw JSON data viewer

## 🚀 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔍 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Hot Reload
The development server supports hot reload. Changes to components will be reflected immediately.

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure FastAPI backend is running on `http://localhost:8000`
   - Check CORS configuration in the backend

2. **Images Not Loading**
   - Verify city images are in `public/images/`
   - Check image file names match the gallery configuration

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Update dependencies: `npm update`

### Error Messages

- **"Cannot connect to API server"** - Backend is not running
- **"No response from server"** - Network connectivity issue
- **"File size must be less than 10MB"** - Image file too large

## 🌟 Features in Detail

### Real-time Analysis
- Progress indicators during long-running operations
- Live status updates from the API
- Graceful error handling and recovery

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review the FastAPI backend documentation
- Ensure all prerequisites are installed

---

**🚨 PostDisaster AI System Frontend - Ready for Disaster Response Analysis!** 🚀