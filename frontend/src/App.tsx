import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  OTPVerificationScreen,
  ChangePasswordScreen,
  PasswordSuccessScreen
} from './components/auth'
import LandingPage from './components/screens/LandingPage'
import DashboardScreen from './components/screens/DashboardScreen'
import DeadlinesScreen from './components/screens/DeadlinesScreen'
import AddDeadlineScreen from './components/screens/AddDeadlineScreen'
import CoursesScreen from './components/screens/CoursesScreen'
import InsightsScreen from './components/screens/InsightsScreen'
import ProfileScreen from './components/screens/ProfileScreen'
import OverloadAlertScreen from './components/screens/OverloadAlertScreen'
import SuggestionScreen from './components/screens/SuggestionScreen'
import SmartPlanScreen from './components/screens/SmartPlanScreen'
import CalendarScreen from './components/screens/CalendarScreen'
import SettingsScreen from './components/screens/SettingsScreen'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'

// Protected Route wrapper - redirects to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Public Route wrapper - redirects to dashboard if already logged in
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// Main App Routes Component
function AppRoutes() {
  const navigate = useNavigate()
  const initializeTheme = useThemeStore((state) => state.initializeTheme)
  const [resetEmail, setResetEmail] = useState('')
  const [resetOtp, setResetOtp] = useState('')

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  // Navigation helper that maps screen names to routes
  const handleNavigate = (screen: string) => {
    const routeMap: Record<string, string> = {
      'landing': '/',
      'login': '/login',
      'register': '/register',
      'forgot-password': '/forgot-password',
      'otp-verification': '/otp-verification',
      'change-password': '/change-password',
      'password-success': '/password-success',
      'dashboard': '/dashboard',
      'deadlines': '/deadlines',
      'add-deadline': '/add-deadline',
      'courses': '/courses',
      'insights': '/insights',
      'profile': '/profile',
      'calendar': '/calendar',
      'settings': '/settings',
      'overload-alert': '/overload-alert',
      'suggestion': '/suggestion',
      'smart-plan': '/smart-plan',
    }
    navigate(routeMap[screen] || '/')
  }

  const handleForgotPasswordSubmit = (email: string) => {
    setResetEmail(email)
    navigate('/otp-verification')
  }

  const handleOTPVerify = (otp: string) => {
    setResetOtp(otp)
    navigate('/change-password')
  }

  const handlePasswordChange = () => {
    navigate('/password-success')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage onNavigate={handleNavigate} />
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute>
            <LoginScreen 
              onLogin={() => navigate('/dashboard')} 
              onNavigate={handleNavigate}
            />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <RegisterScreen 
              onRegister={() => navigate('/login')} 
              onNavigate={handleNavigate}
            />
          </PublicRoute>
        } />
        
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordScreen 
              onNavigate={handleNavigate}
              onSubmit={handleForgotPasswordSubmit}
            />
          </PublicRoute>
        } />
        
        <Route path="/otp-verification" element={
          <PublicRoute>
            <OTPVerificationScreen 
              email={resetEmail}
              onNavigate={handleNavigate}
              onVerify={handleOTPVerify}
              onResend={() => {}}
            />
          </PublicRoute>
        } />
        
        <Route path="/change-password" element={
          <PublicRoute>
            <ChangePasswordScreen 
              email={resetEmail}
              otp={resetOtp}
              onNavigate={handleNavigate}
              onSubmit={handlePasswordChange}
            />
          </PublicRoute>
        } />
        
        <Route path="/password-success" element={
          <PublicRoute>
            <PasswordSuccessScreen 
              onNavigate={handleNavigate}
            />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/deadlines" element={
          <ProtectedRoute>
            <DeadlinesScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/add-deadline" element={
          <ProtectedRoute>
            <AddDeadlineScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/courses" element={
          <ProtectedRoute>
            <CoursesScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/insights" element={
          <ProtectedRoute>
            <InsightsScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute>
            <CalendarScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/overload-alert" element={
          <ProtectedRoute>
            <OverloadAlertScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/suggestion" element={
          <ProtectedRoute>
            <SuggestionScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />
        
        <Route path="/smart-plan" element={
          <ProtectedRoute>
            <SmartPlanScreen onNavigate={handleNavigate} />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
