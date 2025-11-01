# Weekly Plan System - Setup Guide

This guide will walk you through setting up the Weekly Plan System from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Local Development Setup](#local-development-setup)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** installed ([Download](https://git-scm.com/))
- A **Google account** (for Firebase)
- A code editor (VS Code recommended)

### Verify Prerequisites

```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any recent version
```

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `weekly-plan-system` (or your preferred name)
4. **Optional:** Enable Google Analytics (recommended for production)
5. Click **"Create project"**
6. Wait for project creation to complete

### Step 2: Enable Authentication

1. In Firebase Console, navigate to **"Authentication"**
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab
4. Find **"Email/Password"** provider
5. Click to enable it
6. Toggle **"Email/Password"** to ON
7. **DO NOT** enable "Email link (passwordless sign-in)" unless needed
8. Click **"Save"**

### Step 3: Create Firestore Database

1. In Firebase Console, navigate to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
   - We'll deploy custom security rules later
4. Select a location:
   - **Recommended:** `asia-southeast1 (Singapore)` for Asia/Bangkok proximity
   - Other options: Choose closest to your team's location
5. Click **"Enable"**
6. Wait for database creation

### Step 4: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** (⚙️) → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** `</>`
4. Register your app:
   - App nickname: `Weekly Plan Web App`
   - **DO NOT** check "Also set up Firebase Hosting" (we'll do this manually)
5. Click **"Register app"**
6. **Copy the Firebase configuration**:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

7. Click **"Continue to console"**

### Step 5: Deploy Firestore Security Rules

1. In Firestore Database, click **"Rules"** tab
2. Replace ALL content with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user is owner
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      // Anyone authenticated can read all users
      allow read: if isAuthenticated();
      // Users can only create/update their own profile
      allow create, update: if isOwner(userId);
      // No deletes allowed
      allow delete: if false;
    }

    // Projects collection
    match /projects/{projectId} {
      // Anyone authenticated can read all projects
      allow read: if isAuthenticated();
      // Only authenticated users can create projects
      allow create: if isAuthenticated();
      // Only authenticated users can update projects
      allow update: if isAuthenticated();
      // No deletes allowed
      allow delete: if false;
    }

    // Weekly plans collection
    match /weekly_plans/{planId} {
      // Anyone authenticated can read all plans
      allow read: if isAuthenticated();
      // Users can only create/update their own plans
      allow create: if isAuthenticated() && planId.matches(request.auth.uid + '_.*');
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // No deletes allowed
      allow delete: if false;
    }
  }
}
```

3. Click **"Publish"**
4. Confirm by clicking **"Publish"** again

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/aunji/weekly-plan-system.git
cd weekly-plan-system
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- Firebase SDK
- React Router
- date-fns
- i18next
- And all other dependencies

### Step 3: Configure Environment Variables

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Open `.env.local` in your editor:

```bash
# VS Code
code .env.local

# Or use any text editor
nano .env.local
```

3. Replace with your Firebase configuration from Step 4:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Save the file

**IMPORTANT:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 5: Open in Browser

1. Open [http://localhost:5173](http://localhost:5173)
2. You should see the login page
3. Click **"Sign Up"** to create your first account

### Step 6: Create First User

1. Enter email: `test@example.com`
2. Enter password: `password123` (or any password ≥6 characters)
3. Confirm password
4. Click **"Sign Up"**
5. Complete profile:
   - Name: Your name
   - Department: Choose from dropdown
   - Language: English or Thai
6. Click **"Save Profile"**

You're now logged in and can start using the app!

## Deployment

### Option 1: Firebase Hosting (Recommended)

#### Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Login to Firebase

```bash
firebase login
```

Follow the prompts to authenticate with your Google account.

#### Update Firebase Project ID

Edit `.firebaserc` and replace with your project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

#### Build the Project

```bash
npm run build
```

This creates optimized production files in `dist/`.

#### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Your app will be deployed to: `https://your-project-id.web.app`

#### Custom Domain (Optional)

1. In Firebase Console → **Hosting**
2. Click **"Add custom domain"**
3. Follow the wizard to configure DNS
4. Wait for SSL certificate to be provisioned (up to 24 hours)

### Option 2: Vercel

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow prompts and set:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Add environment variables in Vercel Dashboard

### Option 3: Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Build and deploy:

```bash
npm run build
netlify deploy --prod
```

3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. Add environment variables in Netlify Dashboard

## Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Cause:** Incorrect API key in `.env.local`

**Solution:**
1. Go to Firebase Console → Project Settings
2. Copy the correct `apiKey`
3. Update `.env.local`
4. Restart dev server: `npm run dev`

### Issue: "Missing or insufficient permissions"

**Cause:** Firestore security rules not deployed

**Solution:**
1. Go to Firestore Database → Rules
2. Copy rules from `firestore.rules`
3. Click "Publish"

### Issue: Module not found errors

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use

**Cause:** Another process using the port

**Solution:**
```bash
# Option 1: Kill the process
lsof -ti:5173 | xargs kill -9

# Option 2: Use different port
npm run dev -- --port 5174
```

### Issue: Build fails with TypeScript errors

**Cause:** Type errors in code

**Solution:**
```bash
# Check errors
npx tsc --noEmit

# If errors are from dependencies, clear cache
rm -rf node_modules package-lock.json
npm install
```

### Issue: Blank page after deployment

**Cause:** Missing rewrite rules for SPA

**Solution:**

For Firebase Hosting, `firebase.json` already has the correct config.

For other hosts, configure to serve `index.html` for all routes.

### Issue: "Firebase App named '[DEFAULT]' already exists"

**Cause:** Multiple Firebase initializations

**Solution:**
This shouldn't happen with our setup. If it does:
1. Clear browser cache
2. Restart dev server
3. Check you haven't modified `src/config/firebase.ts`

## Next Steps

After successful setup:

1. **Create more users:** Have your team sign up
2. **Create plans:** Navigate to "My Plan" and create your first weekly plan
3. **Explore dashboard:** View team plans on the Dashboard
4. **Check analytics:** View team statistics on the Analytics page
5. **Export data:** Try CSV and JSON exports

## Support

For issues not covered here:

1. Check `README.md` for feature documentation
2. Review `DEV_LOG.md` for development history
3. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

---

**Setup Guide Version:** 1.0.0
**Last Updated:** 2025-11-01
