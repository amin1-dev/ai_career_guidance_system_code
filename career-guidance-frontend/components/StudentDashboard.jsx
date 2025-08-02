import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Progress } from './ui/progress.jsx'
import { Badge } from './ui/badge.jsx'
import { Alert, AlertDescription } from './ui/alert.jsx'
import { Brain, User, FileText, MessageSquare, LogOut, BookOpen, TrendingUp, Loader2 } from 'lucide-react'
import apiService from '../services/api.js'
import '../App.css'

function StudentDashboard({ user, onNavigate, onLogout }) {
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        
        // Check if user has completed quiz
        const quizResponses = await apiService.getUserQuizResponses()
        setQuizCompleted(quizResponses.length > 0)
        
        // Load recommendations if quiz is completed
        if (quizResponses.length > 0) {
          try {
            const recommendationsData = await apiService.getUserRecommendations()
            setRecommendations(recommendationsData.slice(0, 3)) // Show top 3
          } catch (recError) {
            console.error('Failed to load recommendations:', recError)
            // Don't set error here, just leave recommendations empty
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleLogout = async () => {
    try {
      await apiService.logout()
      onLogout()
    } catch (error) {
      console.error('Logout failed:', error)
      // Still call onLogout to clear frontend state
      onLogout()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AI Career Guidance</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            Continue your career exploration journey
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-indigo-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Career Assessment Quiz
                </CardTitle>
                <CardDescription>
                  Complete our comprehensive quiz to get personalized career recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!quizCompleted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm text-gray-600">0%</span>
                    </div>
                    <Progress value={0} className="w-full" />
                    <Button onClick={() => onNavigate('quiz')} className="w-full">
                      Start Career Assessment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <Progress value={100} className="w-full" />
                    <div className="flex space-x-2">
                      <Button onClick={() => onNavigate('recommendations')} className="flex-1">
                        View Results
                      </Button>
                      <Button variant="outline" onClick={() => onNavigate('quiz')}>
                        Retake Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Recommendations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Top Career Matches
                  </CardTitle>
                  <CardDescription>
                    Based on your assessment results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{rec.career}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                        <Badge variant="secondary" className="ml-4">
                          {rec.score}% match
                        </Badge>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onNavigate('recommendations')}
                    >
                      View All Recommendations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('quiz')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Take Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('recommendations')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Recommendations
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('report')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('feedback')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Give Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="outline">
                      {quizCompleted ? 'Assessment Complete' : 'Assessment Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard

