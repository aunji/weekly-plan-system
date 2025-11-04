# Firebase Storage Setup Guide

## Issue: CORS Error When Uploading Files

If you're seeing CORS errors like:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'https://siamkoala.com' has been blocked by CORS policy
```

Follow these steps to fix it:

## Step 1: Deploy Storage Rules

```bash
cd /home/aunji/weekly-plan-system
firebase deploy --only storage
```

This deploys the `storage.rules` file to Firebase Storage.

## Step 2: Configure CORS for Firebase Storage

You need to apply CORS configuration to your Firebase Storage bucket using Google Cloud SDK:

### Option A: Using `gsutil` (Recommended)

1. **Install Google Cloud SDK** (if not already installed):
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Apply CORS configuration**:
   ```bash
   gsutil cors set cors.json gs://weekly-plan-1406f.firebasestorage.app
   ```

3. **Verify CORS is set**:
   ```bash
   gsutil cors get gs://weekly-plan-1406f.firebasestorage.app
   ```

### Option B: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **weekly-plan-1406f**
3. Go to **Storage** section
4. Click on **Rules** tab
5. Make sure rules are deployed
6. For CORS, you'll still need to use `gsutil` (Option A)

## Step 3: Verify Firebase Storage is Initialized

Check your `.env.local` file and make sure `VITE_FIREBASE_STORAGE_BUCKET` is set:

```bash
VITE_FIREBASE_STORAGE_BUCKET=weekly-plan-1406f.firebasestorage.app
```

## Step 4: Test Upload

1. Go to your app: https://siamkoala.com
2. Navigate to Profile page
3. Try uploading a profile picture
4. Navigate to Departments page
5. Try uploading a department icon (SVG)

## Troubleshooting

### Still Getting CORS Errors?

1. **Clear browser cache** and try again
2. **Wait 5-10 minutes** for CORS settings to propagate
3. **Check storage rules are deployed**:
   ```bash
   firebase deploy --only storage --force
   ```

### Permission Denied Errors?

Make sure you're logged in to Firebase:
```bash
firebase login
```

### Wrong Bucket Name?

Double-check your storage bucket name matches in:
- `.env.local` → `VITE_FIREBASE_STORAGE_BUCKET`
- `cors.json` file
- Firebase Console → Storage

## CORS Configuration File

The `cors.json` file allows all origins (`*`) for development. For production, you should restrict this to your domain:

```json
[
  {
    "origin": ["https://siamkoala.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
```

## Security Notes

- The `storage.rules` file restricts who can upload/download
- Users can only upload their own profile pictures
- Only SVG files allowed for department icons
- Maximum file sizes: 5MB (profiles), 1MB (icons)
- All uploads require authentication

## Need Help?

If you're still having issues, check:
1. Firebase Console → Storage → Files (make sure storage is enabled)
2. Browser DevTools → Console (check for specific error messages)
3. Browser DevTools → Network tab (check request headers/response)
