# 🚀 Quick CORS Fix - Copy & Paste Commands

## ✅ Google Cloud SDK is Already Installed!

Just run these commands in your terminal:

### Step 1: Authenticate with Google Cloud
```bash
export PATH="/home/aunji/google-cloud-sdk/bin:$PATH"
gcloud auth login --no-launch-browser
```

**Follow the instructions:**
1. Copy the URL shown in the terminal
2. Open it in your browser
3. Login with: `padungkiat@siamkoala.com`
4. Copy the verification code
5. Paste it back in the terminal

### Step 2: Initialize Firebase Storage (REQUIRED)

Open this URL in your browser:
```
https://console.firebase.google.com/project/weekly-plan-1406f/storage
```

Click "Get Started" and:
- Select location: `asia-southeast1` (recommended for Thailand)
- Click "Done"

### Step 3: Deploy CORS (Run these commands)
```bash
cd /home/aunji/weekly-plan-system
export PATH="/home/aunji/google-cloud-sdk/bin:$PATH"

# Try the default bucket name first
gsutil cors set cors.json gs://weekly-plan-1406f.appspot.com

# If that fails, try this:
gsutil cors set cors.json gs://weekly-plan-1406f.firebasestorage.app

# Deploy storage rules
firebase deploy --only storage
```

### Step 4: Verify
```bash
# Check CORS is deployed
gsutil cors get gs://weekly-plan-1406f.appspot.com

# Or if using the other bucket:
gsutil cors get gs://weekly-plan-1406f.firebasestorage.app
```

### Step 5: Test
1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to: https://siamkoala.com/weekly-plan/departments
3. Upload a department icon - should work!

---

## 📋 Alternative: Use the Automated Script

If you prefer a guided interactive script:

```bash
cd /home/aunji/weekly-plan-system
./auto-fix-cors.sh
```

This script will:
- Guide you through authentication
- Find the correct bucket automatically
- Deploy CORS and storage rules
- Verify everything is working

---

## 🔧 Troubleshooting

**If you get "bucket does not exist":**
- Make sure you initialized Firebase Storage in Step 2!
- Wait 1-2 minutes after initialization
- Try both bucket names (.appspot.com and .firebasestorage.app)

**If you get "permission denied":**
- Make sure you're logged in with the correct account
- Run: `gcloud auth list` to check
- Run: `gcloud auth login` to switch accounts

**Still having issues?**
```bash
# List all buckets to find the correct name
gcloud storage buckets list --project=weekly-plan-1406f

# Then use that exact bucket name
gsutil cors set cors.json gs://YOUR-BUCKET-NAME-HERE
```

---

## ✅ What's Been Done Automatically

1. ✅ Google Cloud SDK installed at `/home/aunji/google-cloud-sdk`
2. ✅ `gsutil` command available
3. ✅ `cors.json` updated with correct domains
4. ✅ `storage.rules` ready to deploy
5. ✅ Firebase CLI already authenticated

**You just need to:**
- Authenticate gcloud (Step 1)
- Initialize Firebase Storage (Step 2)
- Deploy CORS (Step 3)

That's it! 🎉
