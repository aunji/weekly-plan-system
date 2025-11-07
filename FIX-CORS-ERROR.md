# 🔧 Firebase Storage CORS Error Fix Guide

## Problem
CORS error when uploading files (department icons, profile photos) from `https://siamkoala.com` to Firebase Storage.

**Error Message:**
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/weekly-plan-1406f...'
from origin 'https://siamkoala.com' has been blocked by CORS policy
```

## Root Cause
Firebase Storage CORS configuration hasn't been deployed to the storage bucket.

---

## ✅ Solution (Choose ONE approach)

### **Approach 1: Using Automated Script** (EASIEST - Recommended)

#### Run the automated deployment script:
```bash
cd /home/aunji/weekly-plan-system
./DEPLOY-CORS-FIX.sh
```

This script will guide you through:
1. Initializing Firebase Storage (if needed)
2. Finding the correct bucket name
3. Deploying CORS configuration
4. Deploying storage rules
5. Verifying the setup

---

### **Approach 2: Manual CLI Deployment** (For advanced users)

#### Step 0: Initialize Firebase Storage (REQUIRED FIRST!)
```bash
# Go to Firebase Console and initialize Storage:
# https://console.firebase.google.com/project/weekly-plan-1406f/storage
# Click "Get Started" and follow the wizard
```

#### Step 1: Install Google Cloud SDK (if not installed)
```bash
# Download and install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Restart shell
exec -l $SHELL

# Initialize gcloud
gcloud init
```

#### Step 2: Authenticate with Firebase
```bash
# Login to Firebase
firebase login

# Verify login
firebase projects:list
```

#### Step 3: Find Your Bucket Name
```bash
# Check your bucket name (could be .appspot.com or .firebasestorage.app)
firebase apps:sdkconfig web | grep storageBucket

# List all buckets
gsutil ls
```

#### Step 4: Deploy CORS Configuration
```bash
# Navigate to project directory
cd /home/aunji/weekly-plan-system

# Try the primary bucket name first
gsutil cors set cors.json gs://weekly-plan-1406f.appspot.com

# If that fails, try the alternative:
gsutil cors set cors.json gs://weekly-plan-1406f.firebasestorage.app

# Verify CORS is applied
gsutil cors get gs://weekly-plan-1406f.appspot.com
```

#### Step 5: Deploy Storage Rules
```bash
# Deploy storage security rules
firebase deploy --only storage

# Or deploy everything
firebase deploy
```

#### Step 6: Test the Upload
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh your app at https://siamkoala.com
- Try uploading a department icon or profile photo

---

### **Approach 2: Using Firebase Console** (Manual - Easier for non-technical users)

#### Step 1: Access Firebase Console
1. Go to https://console.firebase.google.com
2. Select your project: `weekly-plan-1406f`

#### Step 2: Configure CORS via Cloud Console
1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select project: `weekly-plan-1406f`
3. Navigate to **Cloud Storage** > **Buckets**
4. Find bucket: `weekly-plan-1406f.firebasestorage.app`
5. Click on the bucket name
6. Go to **Configuration** tab
7. Under **CORS Configuration**, click **Edit**
8. Paste this configuration:

```json
[
  {
    "origin": ["https://siamkoala.com", "http://localhost:5173", "http://localhost:4173"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With", "X-Goog-Upload-Protocol", "X-Goog-Upload-Command", "X-Goog-Upload-Status", "X-Goog-Upload-Offset"]
  }
]
```

9. Click **Save**

#### Step 3: Deploy Storage Rules
1. In Firebase Console, go to **Storage** > **Rules**
2. Copy the content from your `storage.rules` file
3. Paste into the editor
4. Click **Publish**

#### Step 4: Test the Upload
- Clear browser cache
- Refresh your app
- Try uploading files

---

### **Approach 3: Quick Command Line Fix** (Fastest if you have access)

If you already have `gcloud` SDK installed:

```bash
# 1. Login to Google Cloud
gcloud auth login

# 2. Set project
gcloud config set project weekly-plan-1406f

# 3. Deploy CORS
cd /home/aunji/weekly-plan-system
gsutil cors set cors.json gs://weekly-plan-1406f.firebasestorage.app

# 4. Verify
gsutil cors get gs://weekly-plan-1406f.firebasestorage.app

# 5. Deploy storage rules (if needed)
firebase login
firebase deploy --only storage
```

---

## 🔍 Verification

After deploying, verify the fix:

### 1. Check CORS Headers
```bash
curl -I -X OPTIONS \
  -H "Origin: https://siamkoala.com" \
  -H "Access-Control-Request-Method: POST" \
  https://firebasestorage.googleapis.com/v0/b/weekly-plan-1406f.firebasestorage.app/o
```

Expected response should include:
```
Access-Control-Allow-Origin: https://siamkoala.com
Access-Control-Allow-Methods: GET, HEAD, PUT, POST, DELETE, OPTIONS
```

### 2. Test Upload in Browser
1. Open https://siamkoala.com
2. Open Developer Console (F12)
3. Go to Department page
4. Try uploading an SVG icon
5. Should work without CORS errors

---

## 🚨 Troubleshooting

### Issue: "gsutil: command not found"
**Solution:** Install Google Cloud SDK (see Approach 1, Step 1)

### Issue: "firebase: command not found"
**Solution:** Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Issue: Still getting CORS errors after deployment
**Solutions:**
1. Clear browser cache completely
2. Wait 5-10 minutes for propagation
3. Check if you're logged in (authentication token required)
4. Verify CORS was actually deployed: `gsutil cors get gs://weekly-plan-1406f.firebasestorage.app`

### Issue: "Permission denied" when deploying
**Solution:**
1. Make sure you're logged in: `firebase login`
2. Check you have Owner/Editor role in Firebase project
3. Try: `gcloud auth application-default login`

### Issue: CORS works locally but not on production
**Solution:**
- Add your production domain to `cors.json`
- Redeploy CORS configuration

---

## 📝 Technical Details

### CORS Configuration Explained
- **origin**: Allowed domains (your app domains)
- **method**: HTTP methods allowed (GET, POST, etc.)
- **maxAgeSeconds**: Browser cache time for preflight requests
- **responseHeader**: Headers that browser can access

### Storage Rules Location
- File: `/home/aunji/weekly-plan-system/storage.rules`
- Deployed to: Firebase Storage Security Rules

### Files Modified
- ✅ `/home/aunji/weekly-plan-system/cors.json` - Updated with specific domains and required headers

---

## 🎯 Quick Reference Commands

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash && exec -l $SHELL

# Login to Firebase
firebase login

# Deploy CORS
cd /home/aunji/weekly-plan-system
gsutil cors set cors.json gs://weekly-plan-1406f.firebasestorage.app

# Deploy Storage Rules
firebase deploy --only storage

# Verify CORS
gsutil cors get gs://weekly-plan-1406f.firebasestorage.app
```

---

## ✨ After Fix Checklist
- [ ] CORS configuration deployed
- [ ] Storage rules deployed
- [ ] Browser cache cleared
- [ ] Department icon upload works
- [ ] Profile photo upload works
- [ ] No CORS errors in console

---

**Need help?** Check the Firebase documentation:
- Storage CORS: https://firebase.google.com/docs/storage/web/download-files#cors_configuration
- Storage Rules: https://firebase.google.com/docs/storage/security

**Created:** 2025-11-07
**Project:** Weekly Plan System
**Storage Bucket:** weekly-plan-1406f.firebasestorage.app
