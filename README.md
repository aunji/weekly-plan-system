# Weekly Plan System

A lightweight multilingual planning tool for small IT/game teams enabling weekly plan logging, progress updates, and blocker visibility.

## Features

- 📝 **Dual Planning Modes**: Daily (Mon-Fri) or Weekly Summary
- 🌍 **Multilingual**: Thai and English support with react-i18next
- 🔒 **Secure Authentication**: Firebase Authentication
- 📊 **Real-time Dashboard**: See all team plans with blocker indicators
- 🚫 **Blocker Tracking**: Highlight and track team blockers
- 📅 **Off-day Management**: Mark and track off-days
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 📤 **CSV Export**: Export plans for reporting
- ⏰ **Asia/Bangkok Timezone**: All timestamps in Bangkok timezone

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **i18n**: react-i18next
- **Date Management**: date-fns + date-fns-tz
- **Routing**: React Router v6

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (LanguageSwitcher, etc.)
│   ├── dashboard/      # Dashboard components
│   └── plan/           # Plan editor components
├── pages/              # Page components
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom React hooks
├── services/           # Firebase services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (date, firestore)
├── config/             # Configuration (Firebase, i18n)
└── locales/            # Translation files (en.json, th.json)
```

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled

## Setup Instructions

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/aunji/weekly-plan-system.git
cd weekly-plan-system
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Get your Firebase configuration from Project Settings
5. Copy \`.env.example\` to \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

6. Update \`.env.local\` with your Firebase credentials:

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

### 4. Deploy Firestore Security Rules

Copy the rules from \`firestore.rules\` to your Firebase Console:
- Go to Firestore Database → Rules
- Paste the content from \`firestore.rules\`
- Publish the rules

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:5173](http://localhost:5173)

## Build for Production

\`\`\`bash
npm run build
\`\`\`

The optimized build will be in the \`dist/\` directory.

## Deployment Options

### Option 1: Firebase Hosting

\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
\`\`\`

### Option 2: FTP/Static Hosting

Build the project and upload the \`dist/\` folder to your web server.

## Firestore Data Structure

### Collections

#### \`users\`
- \`id\`: User ID (matches auth UID)
- \`email\`: User email
- \`name\`: Display name
- \`department\`: Department (IT, Game, Design, QA, Marketing, Management, Other)
- \`language\`: Preferred language (en, th)
- \`projects\`: Array of project IDs
- \`createdAt\`: Timestamp
- \`updatedAt\`: Timestamp

#### \`projects\`
- \`id\`: Project ID
- \`name\`: Project name
- \`isActive\`: Boolean
- \`createdAt\`: Timestamp
- \`updatedAt\`: Timestamp

#### \`weekly_plans\`
- \`id\`: Plan ID
- \`weekIdentifier\`: Week ID (YYYY-WW format)
- \`userId\`: User ID
- \`userName\`: User name (denormalized)
- \`userDepartment\`: User department (denormalized)
- \`mode\`: Planning mode (daily | summary)
- \`dailyPlans\`: Array of daily plans (Mon-Fri)
- \`summary\`: Weekly summary object
- \`updateLogs\`: Array of change logs
- \`createdAt\`: Timestamp
- \`updatedAt\`: Timestamp

## Development Timeline

### ✅ Week 1 - COMPLETED
- [x] React + Vite + TypeScript project setup
- [x] Tailwind CSS configuration
- [x] Firebase Authentication implemented
- [x] i18n (Thai/English) configured
- [x] TypeScript types and interfaces defined
- [x] Protected routes implemented
- [x] Login/Signup/Profile Setup pages
- [x] Firestore security rules created

### 📋 Week 2 - Plan Editor (Next)
- [ ] Daily mode plan editor (Mon-Fri)
- [ ] Weekly summary mode editor
- [ ] Mode switching functionality
- [ ] Firestore integration for plans
- [ ] Update logging system
- [ ] Form validation

### 📋 Week 3 - Dashboard
- [ ] Real-time team dashboard
- [ ] Blocker and off-day indicators
- [ ] Department/project filtering
- [ ] Search functionality
- [ ] Responsive grid layout

### 📋 Week 4 - Features
- [ ] User profile management
- [ ] Project management
- [ ] CSV export functionality
- [ ] Update history viewer

### 📋 Week 5 - Deployment
- [ ] Testing and bug fixes
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Documentation completion

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## Contributing

This project is maintained by the development team. For bug reports or feature requests, please create an issue in the repository.

## License

MIT

## Maintainer

**Lead Dev**: Claude Code
**Repository**: [github.com/aunji/weekly-plan-system](https://github.com/aunji/weekly-plan-system)
**Specs/Logs**: [github.com/aunji/ai-copilot-server/weekly-plan-system/](https://github.com/aunji/ai-copilot-server/tree/main/weekly-plan-system/)

---

**Last Updated**: 2025-11-01 (Bangkok Time)
