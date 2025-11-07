#!/bin/bash

# Auto-fix CORS for Firebase Storage
# This script will guide you through authentication and automatically deploy CORS

set -e  # Exit on error

echo "=============================================="
echo "🔧 Automatic CORS Fix for Firebase Storage"
echo "=============================================="
echo ""

# Set up environment
export PATH="/home/aunji/google-cloud-sdk/bin:$PATH"
cd /home/aunji/weekly-plan-system

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if gcloud is authenticated
echo "Step 1: Checking authentication..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | read account; then
    echo -e "${GREEN}✓ Already authenticated as: $account${NC}"
else
    echo -e "${YELLOW}⚠ Not authenticated with Google Cloud${NC}"
    echo ""
    echo "Opening browser for authentication..."
    echo "Please login with: padungkiat@siamkoala.com"
    echo ""

    # Authenticate
    gcloud auth login --no-launch-browser

    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Authentication failed${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Authentication successful${NC}"
fi

# Step 2: Set project
echo ""
echo "Step 2: Setting project..."
gcloud config set project weekly-plan-1406f
echo -e "${GREEN}✓ Project set to: weekly-plan-1406f${NC}"

# Step 3: List buckets to find the correct one
echo ""
echo "Step 3: Finding Firebase Storage bucket..."
BUCKET_NAME=""

# Try to list buckets
if gcloud storage buckets list --project=weekly-plan-1406f 2>&1 | read -r buckets; then
    echo "Available buckets:"
    gcloud storage buckets list --project=weekly-plan-1406f

    # Check for the expected bucket names
    BUCKET_LIST=$(gcloud storage buckets list --project=weekly-plan-1406f 2>&1)
    if echo "$BUCKET_LIST" | grep -q "weekly-plan-1406f.appspot.com"; then
        BUCKET_NAME="weekly-plan-1406f.appspot.com"
    elif echo "$BUCKET_LIST" | grep -q "weekly-plan-1406f.firebasestorage.app"; then
        BUCKET_NAME="weekly-plan-1406f.firebasestorage.app"
    fi
fi

# If bucket not found, try to create/initialize
if [ -z "$BUCKET_NAME" ]; then
    echo -e "${YELLOW}⚠ Storage bucket not found${NC}"
    echo ""
    echo "You need to initialize Firebase Storage first:"
    echo "1. Go to: https://console.firebase.google.com/project/weekly-plan-1406f/storage"
    echo "2. Click 'Get Started'"
    echo "3. Select location: asia-southeast1"
    echo "4. Click 'Done'"
    echo ""
    read -p "Press ENTER after initializing Firebase Storage..."

    # Try again after initialization
    BUCKET_LIST=$(gcloud storage buckets list --project=weekly-plan-1406f 2>&1)
    if echo "$BUCKET_LIST" | grep -q "weekly-plan-1406f.appspot.com"; then
        BUCKET_NAME="weekly-plan-1406f.appspot.com"
    elif echo "$BUCKET_LIST" | grep -q "weekly-plan-1406f.firebasestorage.app"; then
        BUCKET_NAME="weekly-plan-1406f.firebasestorage.app"
    else
        echo -e "${RED}✗ Still cannot find bucket. Please check Firebase Console.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Found bucket: $BUCKET_NAME${NC}"

# Step 4: Deploy CORS
echo ""
echo "Step 4: Deploying CORS configuration..."
gsutil cors set cors.json "gs://$BUCKET_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ CORS configuration deployed successfully${NC}"
else
    echo -e "${RED}✗ CORS deployment failed${NC}"
    exit 1
fi

# Step 5: Verify CORS
echo ""
echo "Step 5: Verifying CORS configuration..."
echo "Current CORS configuration:"
gsutil cors get "gs://$BUCKET_NAME"

# Step 6: Deploy Storage Rules
echo ""
echo "Step 6: Deploying Firebase Storage rules..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Storage rules deployed successfully${NC}"
else
    echo -e "${YELLOW}⚠ Storage rules deployment had issues (check above)${NC}"
fi

# Final summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ CORS Fix Complete!${NC}"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "2. Go to: https://siamkoala.com/weekly-plan/departments"
echo "3. Try uploading a department icon (SVG)"
echo "4. Try uploading a profile photo"
echo ""
echo "The CORS errors should be fixed! 🎉"
echo ""
