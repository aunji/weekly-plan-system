import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MyPlanPage } from '@/pages/MyPlanPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/setup-profile"
            element={
              <ProtectedRoute requireProfile={false}>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-plan"
            element={
              <ProtectedRoute>
                <MyPlanPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
