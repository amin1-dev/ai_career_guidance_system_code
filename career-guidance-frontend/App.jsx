import { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import AuthForm from './components/AuthForm.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import CareerQuiz from './components/CareerQuiz.jsx'
import CareerRecommendations from './components/CareerRecommendations.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [user, setUser] = useState(null)

  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  const handleAuth = (userData) => {
    setUser(userData)
    if (userData.role === 'admin') {
      setCurrentPage('admin')
    } else {
      setCurrentPage('dashboard')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('landing')
  }

  const handleQuizComplete = (answers) => {
    // Store quiz answers (in a real app, this would be sent to the backend)
    console.log('Quiz completed with answers:', answers)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigation} />
      case 'login':
        return <AuthForm mode="login" onNavigate={handleNavigation} onAuth={handleAuth} />
      case 'register':
        return <AuthForm mode="register" onNavigate={handleNavigation} onAuth={handleAuth} />
      case 'dashboard':
        return <StudentDashboard user={user} onNavigate={handleNavigation} onLogout={handleLogout} />
      case 'quiz':
        return <CareerQuiz onNavigate={handleNavigation} onComplete={handleQuizComplete} />
      case 'recommendations':
        return <CareerRecommendations onNavigate={handleNavigation} />
      default:
        return <LandingPage onNavigate={handleNavigation} />
    }
  }

  return (
    <div className="App">
      {renderPage()}
    </div>
  )
}

export default App
