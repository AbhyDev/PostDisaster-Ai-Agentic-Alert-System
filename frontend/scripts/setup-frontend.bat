@echo off
echo 🚀 Setting up PostDisaster AI Frontend (relocated script)...
pushd %~dp0\..
if not exist package.json (
  echo ❌ Run this from within the frontend folder.
  popd
  exit /b 1
)
node --version >nul 2>&1 || (echo ❌ Node.js missing & popd & exit /b 1)
npm --version >nul 2>&1 || (echo ❌ npm missing & popd & exit /b 1)
echo 📦 Installing deps...
npm install || (echo ❌ Install failed & popd & exit /b 1)
echo ✅ Done. Run: npm run dev
popd
