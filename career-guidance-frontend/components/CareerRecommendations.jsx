import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Badge } from './ui/badge.jsx'
import { Progress } from './ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx'
import { Alert, AlertDescription } from './ui/alert.jsx'
import { Brain, ArrowLeft, Download, TrendingUp, DollarSign, GraduationCap, Users, Loader2 } from 'lucide-react'
import apiService from '../services/api.js'
import '../App.css'

function CareerRecommendations({ onNavigate }) {
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load recommendations from backend on component mount
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true)
        const recommendationsData = await apiService.getUserRecommendations()
        setRecommendations(recommendationsData)
        
        // If no recommendations exist, try to generate them
        if (recommendationsData.length === 0) {
          try {
            const generatedData = await apiService.generateRecommendations()
            setRecommendations(generatedData.recommendations || [])
          } catch (genError) {
            console.error('Failed to generate recommendations:', genError)
            setError('No career recommendations found. Please take the quiz first.')
          }
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error)
        setError('Failed to load career recommendations. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Career Recommendations</h1>
              </div>
              <Button variant="outline" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <Loader2 className="h-16 w-16 text-indigo-600 mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Recommendations</h2>
                <p className="text-gray-600">
                  Fetching your personalized career recommendations...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Career Recommendations</h1>
              </div>
              <Button variant="outline" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Button onClick={() => onNavigate('quiz')}>
                    Take Career Quiz
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Career Recommendations</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onNavigate('report')}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personalized Career Matches
          </h2>
          <p className="text-gray-600">
            Based on your assessment, here are the careers that best match your profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommendations List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Matches</h3>
            {recommendations.map((rec, index) => (
              <Card 
                key={rec.id} 
                className={`cursor-pointer transition-all ${
                  selectedCareer?.id === rec.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCareer(rec)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.career}</CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={rec.score} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-gray-600">{rec.score}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{rec.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Career Details */}
          <div className="lg:sticky lg:top-8">
            {selectedCareer ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    {selectedCareer.career}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedCareer.score} className="flex-1 h-2" />
                    <Badge variant="secondary">{selectedCareer.score}% match</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="outlook">Outlook</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                        <p className="text-gray-600">{selectedCareer.details?.overview}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Work Environment
                        </h4>
                        <p className="text-gray-600">{selectedCareer.details?.workEnvironment}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedCareer.details?.skills?.map((skill, index) => (
                            <Badge key={index} variant="outline" className="justify-center">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="education" className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          Education Requirements
                        </h4>
                        <p className="text-gray-600">{selectedCareer.details?.education}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Salary Range
                        </h4>
                        <p className="text-gray-600">{selectedCareer.details?.salary}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="outlook" className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Job Market Outlook</h4>
                        <p className="text-gray-600">{selectedCareer.details?.outlook}</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a career recommendation to view detailed information</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerRecommendations
