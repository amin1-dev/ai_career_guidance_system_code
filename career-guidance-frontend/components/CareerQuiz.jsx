import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Progress } from './ui/progress.jsx'
import { RadioGroup, RadioGroupItem } from './ui/radio-group.jsx'
import { Label } from './ui/label.jsx'
import { Alert, AlertDescription } from './ui/alert.jsx'
import { Brain, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import apiService from '../services/api.js'
import '../App.css'

function CareerQuiz({ onNavigate, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load questions from backend on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        const questionsData = await apiService.getQuestions()
        setQuestions(questionsData)
      } catch (error) {
        console.error('Failed to load questions:', error)
        setError('Failed to load quiz questions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  // Show loading state while questions are being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Loader2 className="h-16 w-16 text-indigo-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Quiz</h2>
            <p className="text-gray-600">
              Preparing your career assessment questions...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if questions failed to load
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setIsCompleted(true)
      
      // Submit quiz responses to backend
      await apiService.submitQuizResponse(answers)
      
      // Generate recommendations based on the quiz responses
      await apiService.generateRecommendations()
      
      setTimeout(() => {
        onComplete(answers)
        onNavigate('recommendations')
      }, 2000)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      setError('Failed to submit quiz. Please try again.')
      setIsCompleted(false)
    } finally {
      setSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            {error ? (
              <>
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => {
                  setError('')
                  setIsCompleted(false)
                }}>
                  Try Again
                </Button>
              </>
            ) : (
              <>
                {submitting ? (
                  <Loader2 className="h-16 w-16 text-indigo-600 mx-auto mb-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {submitting ? 'Processing...' : 'Quiz Complete!'}
                </h2>
                <p className="text-gray-600 mb-4">
                  {submitting
                    ? 'Submitting your responses and generating personalized recommendations...'
                    : 'Analyzing your responses to generate personalized career recommendations...'
                  }
                </p>
                <Progress value={100} className="w-full" />
              </>
            )}
          </CardContent>
        </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">Career Assessment</h1>
            </div>
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {questions[currentQuestion].question}
            </CardTitle>
            <CardDescription>
              Category: {questions[currentQuestion].category.charAt(0).toUpperCase() + questions[currentQuestion].category.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[questions[currentQuestion].id] || ''}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion].id]}
          >
            {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
            {currentQuestion < questions.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CareerQuiz

