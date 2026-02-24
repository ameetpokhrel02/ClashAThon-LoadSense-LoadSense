import { useState, useEffect } from 'react'
import LoginScreen from './components/screens/LoginScreen'
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
  const [currentScreen, setCurrentScreen] = useState(isLoggedIn ? 'dashboard' : 'login')

  useEffect(() => {
    if (!isLoggedIn && currentScreen !== 'login') {
      setCurrentScreen('login')
    } else if (isLoggedIn && currentScreen === 'login') {
      setCurrentScreen('dashboard')
    }
  }, [isLoggedIn, currentScreen])

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {currentScreen === 'login' && <LoginScreen onLogin={() => handleNavigate('dashboard')} />}
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
