import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Brain, Users, TrendingUp, Shield } from 'lucide-react'
import '../App.css'

function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AI Career Guidance</h1>
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => onNavigate('login')}>
                Login
              </Button>
              <Button onClick={() => onNavigate('register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Discover Your Perfect
            <span className="text-indigo-600"> Career Path</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Our AI-powered system analyzes your interests, skills, and personality to provide 
            personalized career recommendations that align with your unique profile.
          </p>
          <div className="mt-10">
            <Button size="lg" onClick={() => onNavigate('register')} className="mr-4">
              Take the Quiz Now
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Why Choose Our AI Career Guidance?
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Advanced technology meets personalized career counseling
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced machine learning algorithms analyze your responses to provide accurate career matches.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Personalized Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get recommendations tailored specifically to your interests, skills, and personality traits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access current job market trends and salary information for recommended careers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is encrypted and protected with industry-standard security measures.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white">
            Ready to Find Your Dream Career?
          </h3>
          <p className="mt-4 text-xl text-indigo-100">
            Join thousands of students who have discovered their perfect career path
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" onClick={() => onNavigate('register')}>
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 AI Career Guidance System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

