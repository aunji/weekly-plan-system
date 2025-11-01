# Weekly Plan System

A comprehensive multilingual planning tool for small IT/game teams enabling weekly plan logging, progress updates, blocker visibility, and team analytics.

## ✨ Features

### Planning & Collaboration
- 📝 **Dual Planning Modes**: Daily (Mon-Fri) or Weekly Summary
- 🔄 **Real-time Synchronization**: Instant updates across all team members
- 🚫 **Blocker Tracking**: Track blockers with severity levels (High/Medium/Low)
- 📅 **Off-day Management**: Mark and track off-days
- ⌨️ **Keyboard Shortcuts**: Ctrl+S / Cmd+S to save plans

### Dashboard & Analytics
- 📊 **Team Dashboard**: Real-time view of all team members' plans
- 🔍 **Advanced Filtering**: By department, name, blockers, or off-days
- 📈 **Analytics Dashboard**: Comprehensive statistics and trends
- 📉 **Trend Analysis**: 4-week blocker and submission trends
- 💡 **Department Insights**: Plan distribution and off-day tracking

### Data & Export
- 📤 **CSV Export**: Export plans for spreadsheets
- 📦 **JSON Export**: Structured data with full analytics
- 📋 **Update History**: Complete change log for all plans
- 🔐 **Secure Access**: Firebase authentication with protected routes

### User Experience
- 🌍 **Multilingual**: Thai and English with react-i18next
- 📱 **Mobile Responsive**: Seamless experience on all devices
- ⏰ **Asia/Bangkok Timezone**: All timestamps in Bangkok timezone
- 🎨 **Modern UI**: Clean, intuitive design with Tailwind CSS
- ⚡ **Performance**: Code splitting and lazy loading
- 🛡️ **Error Handling**: Graceful error boundaries

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v3
- **Backend**: Firebase (Authentication + Firestore)
- **i18n**: react-i18next
- **Date Management**: date-fns + date-fns-tz
- **Routing**: React Router v6
- **Build Tool**: Vite 5

## 📁 Project Structure

```
weekly-plan-system/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Shared components (LanguageSwitcher, ErrorBoundary)
│   │   ├── dashboard/         # Dashboard components (PlanCard, FilterBar, etc.)
│   │   ├── plan/              # Plan editor components
│   │   └── analytics/         # Analytics components (WeeklyStats, BlockerTrends)
│   ├── pages/                 # Page components (Dashboard, MyPlan, Analytics)
│   ├── contexts/              # React contexts (AuthContext)
│   ├── hooks/                 # Custom hooks (usePlan, useTeamPlans, useAnalytics)
│   ├── services/              # Firebase services (planService)
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions (date, firestore)
│   ├── config/                # Configuration (Firebase, i18n)
│   └── locales/               # Translation files (en.json, th.json)
├── public/                    # Static assets
├── dist/                      # Production build
├── firestore.rules            # Firestore security rules
├── .env.example               # Environment variables template
└── DEV_LOG.md                 # Comprehensive development log

```

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- Git (for version control)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aunji/weekly-plan-system.git
cd weekly-plan-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Enable **Google Analytics** (optional)

#### Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Save

#### Enable Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click "Create database"
3. Choose **"Start in production mode"** (we'll apply custom rules)
4. Select your region (preferably close to Asia/Bangkok)
5. Create

#### Get Firebase Configuration

1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click **Web** icon (</>)
4. Register your app with a nickname (e.g., "Weekly Plan Web")
5. Copy the Firebase configuration object

#### Configure Environment Variables

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

### 4. Deploy Firestore Security Rules

Copy the rules from `firestore.rules` to your Firebase Console:

1. Go to **Firestore Database** → **Rules**
2. Replace all content with the rules from `firestore.rules`
3. Click **Publish**

**Security Rules Summary:**
- Authenticated users can read all documents
- Users can only create/update their own user profile
- Users can only create/update their own weekly plans
- No delete operations allowed
- All writes require authentication

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

**Default Ports:**
- Development: `5173`
- Preview: `4173`

### 6. First-Time Setup

1. Click **"Sign Up"** to create an account
2. Enter email and password
3. Complete your profile:
   - Name
   - Department (IT, Game, Design, QA, Marketing, Management, Other)
   - Preferred language (English/Thai)
4. You'll be redirected to the Dashboard

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

**Production Build Stats:**
- CSS: ~28KB (gzipped: ~6KB)
- JavaScript: ~840KB (gzipped: ~223KB)
- Total: ~868KB

**Optimizations Applied:**
- Code splitting with lazy loading
- Tree shaking
- Minification
- CSS purging
- Gzip compression

## 🚀 Deployment

### Option 1: Firebase Hosting (Recommended)

#### Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Login to Firebase

```bash
firebase login
```

#### Initialize Firebase Hosting

```bash
firebase init hosting
```

**Configuration:**
- Public directory: `dist`
- Single-page app: `Yes`
- Set up automatic builds: `No`
- Overwrite index.html: `No`

#### Deploy

```bash
npm run build
firebase deploy --only hosting
```

Your app will be available at: `https://your-project.firebaseapp.com`

### Option 2: Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts. Build settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Option 3: Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

Build settings:
- Build command: `npm run build`
- Publish directory: `dist`

### Option 4: Static Hosting (cPanel, FTP)

1. Build the project: `npm run build`
2. Upload the entire `dist/` folder to your web server
3. Configure your web server to serve `index.html` for all routes

## 🗃️ Firestore Data Structure

### Collections

#### `users`
```typescript
{
  id: string;              // User ID (matches Firebase Auth UID)
  email: string;           // User email
  name: string;            // Display name
  department: string;      // IT | Game | Design | QA | Marketing | Management | Other
  language: string;        // en | th
  projects: string[];      // Array of project IDs
  createdAt: Timestamp;    // Account creation time
  updatedAt: Timestamp;    // Last profile update
}
```

#### `projects`
```typescript
{
  id: string;              // Project ID
  name: string;            // Project name
  isActive: boolean;       // Active status
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `weekly_plans`
```typescript
{
  id: string;              // Format: userId_weekIdentifier
  weekIdentifier: string;  // Format: YYYY-WW (e.g., "2024-W45")
  userId: string;
  userName: string;        // Denormalized for faster queries
  userDepartment: string;  // Denormalized for filtering
  mode: string;            // daily | summary

  // Daily mode data
  dailyPlans: Array<{
    date: string;          // ISO date string
    tasks: string[];       // Array of task descriptions
    isOffDay: boolean;
    blockers: Array<{
      description: string;
      severity: string;    // high | medium | low
      isResolved: boolean;
    }>;
  }>;

  // Summary mode data
  summary: {
    achievements: string;
    challenges: string;
    nextWeekPlans: string;
  } | null;

  // Metadata
  updateLogs: Array<{
    timestamp: Timestamp;
    field: string;
    oldValue: string | null;
    newValue: string | null;
    userId: string;
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Indexes

Firestore automatically creates indexes for single-field queries. For the dashboard filtering, you may need to create a composite index:

**Collection:** `weekly_plans`
- `weekIdentifier` (Ascending)
- `userDepartment` (Ascending)

Create this index when prompted by Firebase or manually in the Firebase Console.

## 📖 Usage Guide

### Creating a Weekly Plan

1. Navigate to **"My Plan"** from the navigation menu
2. Choose your planning mode:
   - **Daily Mode**: Plan tasks for each weekday (Monday-Friday)
   - **Summary Mode**: Write a weekly summary

#### Daily Mode

For each weekday:
- Add tasks using the **"Add Task"** button
- Mark as **"Off Day"** if not working
- Add blockers with severity levels:
  - **High**: Critical blocker preventing progress
  - **Medium**: Significant blocker causing delays
  - **Low**: Minor blocker or inconvenience
- Mark blockers as **resolved** when fixed

#### Summary Mode

Write free-form text for:
- **Achievements**: What you accomplished this week
- **Challenges**: Difficulties or blockers encountered
- **Next Week Plans**: What you plan to do next week

3. Click **"Save Plan"** or press **Ctrl+S** (Cmd+S on Mac)

### Viewing Team Plans

1. Navigate to **"Dashboard"** from the navigation menu
2. Use the **Week Selector** to view different weeks
3. Apply filters:
   - **Department**: Filter by specific department
   - **Search**: Search by team member name
   - **Show Blockers Only**: See only plans with active blockers
   - **Show Off Days Only**: See only plans with off-days
4. Click any plan card to view full details

### Analytics Dashboard

1. Navigate to **"Analytics"** from the navigation menu
2. View weekly statistics:
   - Total plans submitted
   - Active blockers count
   - Off-days count
   - Average tasks per plan
3. Enable **"Show Trends"** for 4-week analysis
4. Export data:
   - **CSV**: For spreadsheet analysis
   - **JSON**: For programmatic access

### Exporting Data

#### CSV Export
- Contains: Week, User, Department, Mode, Tasks, Blockers (H/M/L), Off Days
- Filename: `weekly-plans-YYYY-WW.csv`
- Use in Excel, Google Sheets, or any spreadsheet software

#### JSON Export
- Contains: Full plan details + analytics summary
- Filename: `weekly-plans-YYYY-WW.json`
- Use for data analysis or integration with other tools

## 🧪 Development

### Scripts

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Build
npm run build        # Build for production
npm run lint         # Run ESLint

# Type Checking
npx tsc --noEmit     # Check TypeScript types
```

### Code Structure Guidelines

**Components:**
- Use functional components with TypeScript
- Props interfaces defined above component
- Use `React.FC<Props>` for component typing

**Hooks:**
- Custom hooks start with `use`
- Return objects with clear property names
- Include loading and error states

**Services:**
- One service per Firebase collection
- Use Firestore converters for type safety
- Export async functions with proper error handling

**Utilities:**
- Pure functions for date/time operations
- Bangkok timezone (Asia/Bangkok) for all operations
- Proper TypeScript typing

### Adding a New Language

1. Create translation file: `src/locales/{language}.json`
2. Copy structure from `en.json`
3. Translate all keys
4. Update `src/config/i18n.ts`:

```typescript
import thTranslations from '@/locales/th.json';
import enTranslations from '@/locales/en.json';
import newLangTranslations from '@/locales/{language}.json';

const resources = {
  th: { translation: thTranslations },
  en: { translation: enTranslations },
  {language}: { translation: newLangTranslations },
};
```

5. Update language selector in `LanguageSwitcher.tsx`

### Adding a New Department

1. Update type in `src/types/index.ts`:

```typescript
export type Department =
  | 'IT'
  | 'Game'
  | 'Design'
  | 'QA'
  | 'Marketing'
  | 'Management'
  | 'Other'
  | 'YourNewDepartment';
```

2. Add translations in `src/locales/en.json` and `th.json`:

```json
"departments": {
  "YourNewDepartment": "Your New Department"
}
```

## 📊 Development Timeline

### ✅ Week 1 - Foundation & Setup (COMPLETED)
- [x] React + Vite + TypeScript project setup
- [x] Tailwind CSS configuration
- [x] Firebase Authentication implemented
- [x] i18n (Thai/English) configured
- [x] TypeScript types and interfaces defined
- [x] Protected routes implemented
- [x] Login/Signup/Profile Setup pages
- [x] Firestore security rules created

### ✅ Week 2 - Plan Editor (COMPLETED)
- [x] Daily mode plan editor (Mon-Fri)
- [x] Weekly summary mode editor
- [x] Mode switching functionality
- [x] Blocker management with severity levels
- [x] Firestore integration for plans
- [x] Real-time plan updates
- [x] Update logging system
- [x] Form validation
- [x] Keyboard shortcuts (Ctrl+S)

### ✅ Week 3 - Dashboard (COMPLETED)
- [x] Real-time team dashboard
- [x] Week navigation (previous/current/next)
- [x] Plan cards with blocker indicators
- [x] Blocker severity badges
- [x] Off-day indicators
- [x] Department filtering
- [x] Search by name
- [x] "Blockers only" filter
- [x] "Off-days only" filter
- [x] Responsive 3-column grid layout
- [x] Loading and empty states

### ✅ Week 4 - Plan Details & Analytics (COMPLETED)
- [x] Full plan detail modal
- [x] Update history display
- [x] Edit access control
- [x] Analytics dashboard
- [x] Weekly statistics cards
- [x] Department breakdowns
- [x] Blocker severity analysis
- [x] Mode distribution charts
- [x] 4-week trend analysis
- [x] Blocker trends visualization
- [x] Plan submission trends
- [x] CSV export functionality
- [x] JSON export functionality

### ✅ Week 5 - Optimization & Deployment (IN PROGRESS)
- [x] Lazy loading for pages
- [x] Code splitting
- [x] Error boundaries
- [x] Loading suspense
- [x] Comprehensive README
- [ ] Firebase Hosting configuration
- [ ] Production deployment
- [ ] Performance monitoring

## 🐛 Troubleshooting

### Build Errors

**Issue:** `Cannot find module '@/...'`
- **Solution:** Check `vite.config.ts` and `tsconfig.app.json` path aliases

**Issue:** Firebase configuration errors
- **Solution:** Verify all environment variables in `.env.local` are correct

### Runtime Errors

**Issue:** "Firebase: Error (auth/invalid-email)"
- **Solution:** Ensure email format is valid

**Issue:** "Missing or insufficient permissions"
- **Solution:** Check Firestore security rules are deployed correctly

### Performance Issues

**Issue:** Slow page loads
- **Solution:** Build for production (`npm run build`) - development mode is slower

**Issue:** Large bundle size warnings
- **Solution:** This is expected. Bundle is ~840KB but gzips to ~223KB

## 🤝 Contributing

This project is maintained by the development team. For bug reports or feature requests:

1. Check existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce (for bugs)
4. Include expected vs actual behavior

## 📝 License

MIT License - See LICENSE file for details

## 👥 Credits

**Lead Developer:** Claude Code
**Project Owner:** @aunji
**Repository:** [github.com/aunji/weekly-plan-system](https://github.com/aunji/weekly-plan-system)
**Development Logs:** See `DEV_LOG.md` for complete development history

## 🔗 Related Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Last Updated:** 2025-11-01 (Bangkok Time)
**Version:** 1.0.0
**Status:** Production Ready ✅
