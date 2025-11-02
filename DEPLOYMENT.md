# Deployment Guide - Weekly Plan System

## Quick Deployment

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase account authenticated (`firebase login`)
- Build completed successfully

### Option 1: Use Deployment Script (Recommended)

```bash
cd /home/aunji/weekly-plan-system
./deploy.sh
```

This script will:
1. Verify Firebase CLI installation
2. Check authentication
3. Build the project
4. Deploy to Firebase Hosting

### Option 2: Manual Deployment

```bash
cd /home/aunji/weekly-plan-system

# Login to Firebase (if not already logged in)
firebase login

# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore rules (important!)
firebase deploy --only firestore:rules
```

## Firebase Project Configuration

**Project ID:** `weekly-plan-1406f`

**Hosting URL:** `https://weekly-plan-1406f.web.app`

**Alternative URL:** `https://weekly-plan-1406f.firebaseapp.com`

## Post-Deployment Checklist

After deployment, verify the following:

- [ ] Application loads at the hosting URL
- [ ] User can sign up with email/password
- [ ] User can log in
- [ ] Profile setup page works
- [ ] Dashboard displays correctly
- [ ] My Plan page allows creating/editing plans
- [ ] Analytics page loads with data
- [ ] Language switching works (EN/TH)
- [ ] Real-time updates work across multiple browsers
- [ ] Export functionality works (CSV/JSON)
- [ ] Mobile responsive design works

## Firestore Security Rules

**IMPORTANT:** Don't forget to deploy Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

Or manually copy the rules from `firestore.rules` to Firebase Console:
1. Go to Firebase Console → Firestore Database → Rules
2. Copy content from `firestore.rules`
3. Paste and publish

## Environment Variables

The `.env.local` file contains your Firebase configuration:

```
VITE_FIREBASE_API_KEY=AIzaSyABAOTXLztQiyGokkm6XZGYuthIiuDuWLQ
VITE_FIREBASE_AUTH_DOMAIN=weekly-plan-1406f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=weekly-plan-1406f
VITE_FIREBASE_STORAGE_BUCKET=weekly-plan-1406f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=378324990609
VITE_FIREBASE_APP_ID=1:378324990609:web:c2979fced8f09437791d30
```

**Note:** These are already configured. No changes needed.

## CI/CD Deployment

For automated deployments (GitHub Actions, etc.), you'll need a CI token:

```bash
# Generate a CI token
firebase login:ci

# Use the token in your CI/CD pipeline
firebase deploy --only hosting --token $FIREBASE_TOKEN
```

## Troubleshooting

### Issue: "Firebase login required"
**Solution:** Run `firebase login` to authenticate

### Issue: "Project not found"
**Solution:** Verify `.firebaserc` contains the correct project ID

### Issue: Build fails
**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Run `npm run build`

### Issue: 404 on page refresh
**Solution:** This is already configured in `firebase.json` with rewrites to `index.html`

## Custom Domain Setup

To use a custom domain:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the wizard to add DNS records
4. Wait for SSL certificate provisioning (24-48 hours)

## Performance Monitoring

To enable Firebase Performance Monitoring:

```bash
npm install firebase/performance
```

Then follow the setup guide in the Firebase documentation.

## Rollback

If you need to rollback to a previous version:

```bash
# List hosting versions
firebase hosting:channel:list

# Rollback to a specific version
firebase hosting:clone source:VERSION_ID target:live
```

## Build Size Optimization

Current build size: ~872KB (234KB gzipped)

To further optimize:
1. Use dynamic imports for large components
2. Implement route-based code splitting (already done)
3. Use lazy loading for images
4. Consider using a CDN for static assets

## Support

For issues or questions:
- Check `DEV_LOG.md` for development history
- Check `README.md` for feature documentation
- Check `SETUP_GUIDE.md` for detailed setup instructions

---

**Last Updated:** 2025-11-01 (Bangkok Time)
**Project Status:** Ready for Deployment ✅
