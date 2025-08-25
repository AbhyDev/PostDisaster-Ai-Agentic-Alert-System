# 🚨 PostDisaster AI System - Complete Full-Stack Application

A comprehensive AI-powered disaster response system that analyzes satellite imagery and provides intelligent disaster response recommendations using CrewAI agents.

## 🌟 **SYSTEM OVERVIEW**

```
🛰️ Satellite Image → 🤖 AI Analysis → 🏙️ City Detection → 👥 CrewAI Agents → 📊 Disaster Response Plan
```

### **Complete Workflow:**
1. **📸 Upload satellite image** or select from city gallery
2. **🛰️ Gemini AI analyzes** the image and detects the city
3. **🤖 CrewAI agents collaborate** to create comprehensive disaster response:
   - **Data Collector**: Searches city-specific data
   - **Needs Analyst**: Analyzes population and essential needs
   - **Help Dispatcher**: Calculates emergency resources needed
   - **Resource Allocator**: Estimates food supply requirements
   - **Damage Analyser**: Assesses infrastructure damage

## 🚀 **QUICK START - Complete System**

All backend code now lives under `backend/` and all frontend assets under `frontend/`.

### **Option 1: Full Stack Startup (Recommended)**
```bash
python backend/start_full_stack.py
```
This will:
- ✅ Install Python deps (requirements.txt)
- ✅ Install frontend deps (npm install)
- ✅ Start FastAPI backend (port 8000)
- ✅ Start React frontend (port 3000)
- ✅ Keep both processes monitored

### **Option 2: Backend Only**
```bash
python backend/start_backend.py
```
Then open http://localhost:8000 (docs at /docs).

### **Option 3: Manual (advanced)**
Backend:
```bash
python -m uvicorn backend.main_api:app --host 0.0.0.0 --port 8000
```
Frontend (in another terminal):
```bash
cd frontend
npm install  # first time only
npm run dev
```

## 🌐 **Access Points**

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Frontend** | http://localhost:3000 | Main user interface |
| 🚀 **Backend API** | http://localhost:8000 | FastAPI server |
| 📚 **API Docs** | http://localhost:8000/docs | Interactive API documentation |

## 🏗️ **System Architecture**

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   React Frontend│ ◄──────────────► │  FastAPI Backend │
│   (Port 3000)   │                 │   (Port 8000)    │
└─────────────────┘                 └──────────────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │  AI Services     │
                                    │  • Gemini Vision │
                                    │  • CrewAI Agents │
                                    └──────────────────┘
```

## 📁 **Project Structure (Consolidated)**

The repository has been simplified to only two top‑level code folders: `backend/` and `frontend/`.

```
PostDisaster-AI-Agentic-Alert-System/
├── backend/
│   ├── __init__.py
│   ├── main_api.py              # FastAPI application (single source of truth)
│   ├── postdisaster_system.py   # CrewAI orchestration logic
│   ├── satellite.py             # Satellite image -> city detection logic
│   ├── start_backend.py         # (optional) backend-only startup helper
│   └── start_full_stack.py      # (optional) launch backend + frontend
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── images/              # City images
│   │   └── frontend_test.html   # Legacy standalone test page (relocated)
│   ├── scripts/
│   │   ├── setup-frontend.sh
│   │   └── setup-frontend.bat
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       └── services/
├── Cities.docx
├── Dummy Cities/
├── Output_Images/
├── uploads/                     # Runtime upload dir (created automatically)
├── requirements.txt
├── pyproject.toml
├── FASTAPI_COMPLETE.md
├── INTEGRATION_SUMMARY.md
└── README.md
```

Removed duplicate root copies of `main_api.py`, `satellite.py`, `postdisaster_system.py`, `frontend_api.py`, and legacy startup scripts. Authoritative versions now live only inside `backend/` (plus the existing React `frontend/`).

### Running (after restructuring)

Backend only:
```bash
python backend/start_backend.py
```

Full stack (backend + React dev server):
```bash
python backend/start_full_stack.py
```

Manual alternative:
```bash
python -m uvicorn backend.main_api:app --host 0.0.0.0 --port 8000
cd frontend && npm run dev
```

> NOTE: Test scripts still reference old import paths (e.g. `from satellite import ...`). If you keep them, update imports to `from backend.satellite import ...` or run with `PYTHONPATH=.`. Otherwise delete them if no longer needed.

## 🎯 **Features**

### **🎨 Frontend Features**
- ✅ **Drag & Drop Image Upload** with progress tracking
- ✅ **City Gallery** with interactive selection
- ✅ **Real-time API Status** monitoring
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **Interactive Results Display** with collapsible sections
- ✅ **Error Handling** with user-friendly messages

### **🚀 Backend Features**
- ✅ **6 REST API Endpoints** for complete functionality
- ✅ **File Upload Handling** with validation
- ✅ **CORS Support** for frontend integration
- ✅ **Real-time Processing** of images and analysis
- ✅ **Error Handling** and logging
- ✅ **API Documentation** with Swagger/OpenAPI

### **🤖 AI Features**
- ✅ **Gemini Vision API** for satellite image analysis
- ✅ **5 Specialized CrewAI Agents** for disaster response
- ✅ **Dynamic City Detection** (no hardcoding)
- ✅ **Mock Mode** for testing without API keys
- ✅ **Comprehensive Analysis** covering all disaster aspects

## 🔧 **Configuration**

### **Environment Setup**
Create `.env` file:
```bash
GOOGLE_API_KEY=your_google_api_key_here
```

### **Available Cities**
The system supports 5 cities:
1. **Seabrook City** (ID: 1)
2. **Highland Park City** (ID: 2)
3. **Baytown City** (ID: 3)
4. **Ridgeview City** (ID: 4)
5. **Shoreline City** (ID: 5)

## 📊 **API Endpoints**

| Method | Endpoint | Description | Frontend Use |
|--------|----------|-------------|--------------|
| `GET` | `/` | API information | Status check |
| `GET` | `/cities/` | List available cities | City dropdown |
| `POST` | `/analyze-image/` | Image analysis only | Quick analysis |
| `GET` | `/analyze-city/{id}` | City-specific analysis | Direct city analysis |
| `POST` | `/complete-analysis/` | **Full workflow** | **Main feature** |
| `GET` | `/test-analysis/` | Test with Baytown | Demo/testing |

## 🧪 **Testing**

### **Frontend Testing**
```bash
# Open browser and test:
http://localhost:3000
```

### **Backend Testing**
```bash
# API Documentation
http://localhost:8000/docs

# Run test scripts
python test_api.py
python test_integration.py
python complete_test.py
```

### **Complete System Test**
1. Start complete system: `python start_complete_system.py`
2. Open frontend: http://localhost:3000
3. Upload a city image or select from gallery
4. Click "Complete Analysis"
5. View results in real-time

## 🚀 **Deployment**

### **Development**
- Frontend: `npm run dev` (port 3000)
- Backend: `python -m uvicorn backend.main_api:app --host 0.0.0.0 --port 8000`

### **Production**
- Frontend: `npm run build` → Deploy static files
- Backend: Use `uvicorn backend.main_api:app --host 0.0.0.0 --port 8000`

## 🐛 **Troubleshooting**

### **Common Issues**

1. **"Cannot connect to API server"**
   - ✅ Ensure backend is running on port 8000
   - ✅ Check CORS configuration

2. **"Images not loading"**
   - ✅ Verify images are in `frontend/public/images/`
   - ✅ Check image file names

3. **"CrewAI analysis failed"**
   - ✅ Check `.env` file has valid API key
   - ✅ Verify internet connection
   - ✅ Try mock mode for testing

4. **"Frontend won't start"**
   - ✅ Run `npm install` in frontend directory
   - ✅ Check Node.js version (16+)

### **System Requirements**
- **Python**: 3.8+
- **Node.js**: 16+
- **RAM**: 4GB+ (for CrewAI processing)
- **Storage**: 2GB+ for dependencies

## 🎉 **Success Indicators**

When everything is working correctly, you should see:

```bash
✅ FastAPI Server: RUNNING on http://localhost:8000
✅ React Frontend: RUNNING on http://localhost:3000
✅ Satellite Analysis: WORKING
✅ CrewAI Integration: FUNCTIONAL
✅ File Upload: WORKING
✅ API Documentation: Available at /docs
```

## 🌟 **Key Benefits**

- 🚀 **No More Hardcoding**: Dynamic city detection from images
- 🤖 **Real AI Power**: Gemini + CrewAI for intelligent analysis
- 🎨 **Modern UI**: React-based responsive interface
- 📊 **Complete Workflow**: End-to-end disaster response analysis
- 🔧 **Production Ready**: Proper error handling and validation
- 📱 **Cross-Platform**: Works on all devices and browsers

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support:
1. Check troubleshooting section above
2. Review API documentation at `/docs`
3. Test with the provided test scripts
4. Ensure all requirements are met

---

## 🎯 **Ready to Use!**

Your **PostDisaster AI System** is now a complete full-stack application with:
- ✅ **Modern React Frontend**
- ✅ **FastAPI Backend**
- ✅ **AI-Powered Analysis**
- ✅ **Real-time Processing**
- ✅ **Production-Ready Architecture**

**🚨 Start saving lives with AI-powered disaster response! 🚀**