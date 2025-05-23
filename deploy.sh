#!/bin/bash

# Navigate to the frontend directory
echo "Building the frontend..."
cd "/Users/daipayanhati/Desktop/Personal Projects/jobs.ai"
npm run build

# Deploy the frontend using Firebase
echo "Deploying the frontend to Firebase..."
firebase deploy

# Navigate to the backend directory
echo "Deploying the backend to Google App Engine..."
cd backend

# Deploy the backend using Google Cloud SDK
gcloud app deploy

echo "Deployment complete!"
