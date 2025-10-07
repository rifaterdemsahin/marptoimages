#!/bin/bash

# Marp to Images - Server Startup Script

echo "🚀 Starting Marp to Images Server..."
echo ""

# Navigate to the correct directory
cd marp-to-images

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Starting server on http://localhost:3000"
echo "📖 Troubleshooting guide: https://github.com/rifaterdemsahin/marptoimages/blob/main/Semblance/TROUBLESHOOTING.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"
echo ""

# Start the server
npm start
