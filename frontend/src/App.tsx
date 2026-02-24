import { useState, useEffect } from 'react'
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
import AddDeadlineScreen from './components/screens/AddDeadlineScreen'
import OverloadAlertScreen from './components/screens/OverloadAlertScreen'
import SuggestionScreen from './components/screens/SuggestionScreen'
import CoursesScreen from './components/screens/CoursesScreen'
import CalendarScreen from './components/screens/CalendarScreen'
import SettingsScreen from './components/screens/SettingsScreen'
import { useAuthStore } from './store/authStore'

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [currentScreen, setCurrentScreen] = useState(isLoggedIn ? 'dashboard' : 'landing')
  const [resetEmail, setResetEmail] = useState('')

  useEffect(() => {
    if (!isLoggedIn && !['landing', 'login', 'register', 'forgot-password', 'otp-verification', 'change-password', 'password-success'].includes(currentScreen)) {
      setCurrentScreen('landing')
    } else if (isLoggedIn && ['landing', 'login', 'register', 'forgot-password', 'otp-verification', 'change-password', 'password-success'].includes(currentScreen)) {
      setCurrentScreen('dashboard')
    }
  }, [isLoggedIn, currentScreen])

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen)
  }

  const handleForgotPasswordSubmit = (email: string) => {
    setResetEmail(email)
    handleNavigate('otp-verification')
  }

  const handleOTPVerify = () => {
    handleNavigate('change-password')
  }

  const handlePasswordChange = () => {
    handleNavigate('password-success')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Landing Page */}
      {currentScreen === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {/* Auth Screens */}
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={() => handleNavigate('dashboard')} 
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen 
          onRegister={() => handleNavigate('dashboard')} 
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen 
          onNavigate={handleNavigate}
          onSubmit={handleForgotPasswordSubmit}
        />
      )}
      {currentScreen === 'otp-verification' && (
        <OTPVerificationScreen 
          email={resetEmail}
          onNavigate={handleNavigate}
          onVerify={handleOTPVerify}
          onResend={() => {}}
        />
      )}
      {currentScreen === 'change-password' && (
        <ChangePasswordScreen 
          email={resetEmail}
          onNavigate={handleNavigate}
          onSubmit={handlePasswordChange}
        />
      )}
      {currentScreen === 'password-success' && (
        <PasswordSuccessScreen 
          onNavigate={handleNavigate}
        />
      )}

      {/* App Screens */}
      {currentScreen === 'dashboard' && <DashboardScreen onNavigate={handleNavigate} />}
      {currentScreen === 'courses' && <CoursesScreen onNavigate={handleNavigate} />}
      {currentScreen === 'calendar' && <CalendarScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings' && <SettingsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'add-deadline' && <AddDeadlineScreen onNavigate={handleNavigate} />}
      {currentScreen === 'overload-alert' && <OverloadAlertScreen onNavigate={handleNavigate} />}
      {currentScreen === 'suggestion' && <SuggestionScreen onNavigate={handleNavigate} />}
    </div>
  )
}

export default App
