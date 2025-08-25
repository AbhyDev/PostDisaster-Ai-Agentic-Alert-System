#!/bin/bash
set -e
echo "🚀 Setting up PostDisaster AI Frontend (relocated script)..."
cd "$(dirname "$0")/.."
if [ ! -f package.json ]; then
  echo "❌ package.json not found – run from project root or adjust path"
  exit 1
fi
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not installed"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "❌ npm not installed"; exit 1; }
echo "📦 Installing deps..."
npm install
echo "✅ Done. Start dev server with: npm run dev"
