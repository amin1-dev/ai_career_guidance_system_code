import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key-change-this')

# Enable CORS for all routes
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
CORS(app, supports_credentials=True, origins=cors_origins)

@app.route('/')
def health_check():
    return jsonify({
        'message': 'AI Career Guidance API is running',
        'status': 'healthy',
        'version': '1.0.0'
    })

@app.route('/api/test')
def test_endpoint():
    return jsonify({
        'message': 'Backend API is working!',
        'endpoints': [
            '/api/auth/register',
            '/api/auth/login', 
            '/api/quiz/questions',
            '/api/recommendations'
        ]
    })

if __name__ == '__main__':
    print("🚀 Starting AI Career Guidance Backend...")
    print("📍 Server running at: http://localhost:5000")
    print("🔗 Health check: http://localhost:5000")
    print("🧪 Test endpoint: http://localhost:5000/api/test")
    app.run(host='0.0.0.0', port=5000, debug=True)