#!/bin/bash

echo "================================================"
echo "Firebase Storage CORS Deployment Fix"
echo "================================================"
echo ""
echo "⚠️  Firebase Storage is not fully initialized!"
echo ""
echo "STEP 1: Initialize Firebase Storage"
echo "------------------------------------"
echo "1. Go to: https://console.firebase.google.com/project/weekly-plan-1406f/storage"
echo "2. Click 'Get Started'"
echo "3. Choose 'Start in production mode' or 'Start in test mode'"
echo "4. Select a location (asia-southeast1 recommended for Thailand)"
echo "5. Click 'Done'"
echo ""
echo "Press ENTER after completing Step 1..."
read

echo ""
echo "STEP 2: Check which bucket was created"
echo "---------------------------------------"
firebase apps:sdkconfig web | grep storageBucket
echo ""

# Try appspot.com bucket first (older Firebase projects)
echo ""
echo "STEP 3: Deploy CORS configuration"
echo "----------------------------------"
echo "Trying bucket: weekly-plan-1406f.appspot.com"
gsutil cors set cors.json gs://weekly-plan-1406f.appspot.com 2>&1
RESULT1=$?

if [ $RESULT1 -ne 0 ]; then
    echo ""
    echo "Trying bucket: weekly-plan-1406f.firebasestorage.app"
    gsutil cors set cors.json gs://weekly-plan-1406f.firebasestorage.app 2>&1
    RESULT2=$?

    if [ $RESULT2 -ne 0 ]; then
        echo ""
        echo "❌ Both bucket names failed!"
        echo ""
        echo "Please install Google Cloud SDK:"
        echo "  curl https://sdk.cloud.google.com | bash"
        echo "  exec -l \$SHELL"
        echo "  gcloud init"
        echo ""
        echo "Then run: gsutil ls"
        echo "This will show your actual bucket name."
        exit 1
    fi
fi

echo ""
echo "STEP 4: Deploy Storage Rules"
echo "-----------------------------"
firebase deploy --only storage

echo ""
echo "STEP 5: Verify CORS"
echo "-------------------"
echo "Testing appspot.com bucket:"
gsutil cors get gs://weekly-plan-1406f.appspot.com 2>&1
echo ""
echo "Testing firebasestorage.app bucket:"
gsutil cors get gs://weekly-plan-1406f.firebasestorage.app 2>&1

echo ""
echo "================================================"
echo "✅ CORS Deployment Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Clear browser cache (Ctrl+Shift+Delete)"
echo "2. Go to https://siamkoala.com/weekly-plan/departments"
echo "3. Try uploading a department icon"
echo "4. Check browser console - CORS errors should be gone!"
echo ""
