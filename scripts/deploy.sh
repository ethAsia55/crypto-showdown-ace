#!/bin/bash

# Crypto Showdown Ace - Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 Starting Crypto Showdown Ace deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live on Vercel"
    echo "📝 Don't forget to:"
    echo "   1. Set up environment variables in Vercel dashboard"
    echo "   2. Deploy your smart contracts"
    echo "   3. Update contract addresses"
    echo "   4. Test wallet connections"
else
    echo "❌ Deployment failed. Check the errors above."
    exit 1
fi
