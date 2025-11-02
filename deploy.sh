#!/bin/bash

# Weekly Plan System - Deployment Script
# This script builds and deploys the application to Firebase Hosting

set -e  # Exit on error

echo "🚀 Weekly Plan System - Deployment Script"
echo "=========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "Please install it with: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase"
    echo "Please run: firebase login"
    exit 1
fi

echo "✅ Firebase authentication verified"
echo ""

# Build the project
echo "📦 Building project for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "Your application is now live at:"
    echo "https://weekly-plan-1406f.web.app"
    echo ""
    echo "Don't forget to deploy Firestore rules:"
    echo "firebase deploy --only firestore:rules"
else
    echo "❌ Deployment failed!"
    exit 1
fi
