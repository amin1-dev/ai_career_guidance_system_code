import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from models.user import db
from routes.user import user_bp
from routes.auth import auth_bp
from routes.quiz import quiz_bp
from routes.recommendations import recommendations_bp
from routes.feedback import feedback_bp

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key-change-this')
app.config['WTF_CSRF_TIME_LIMIT'] = None
app.config['SESSION_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Initialize CSRF protection (disabled for development)
# csrf = CSRFProtect(app)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
limiter.init_app(app)

# Enable CORS for all routes
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
CORS(app, supports_credentials=True, origins=cors_origins)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
app.register_blueprint(recommendations_bp, url_prefix='/api')
app.register_blueprint(feedback_bp, url_prefix='/api')

# Database configuration
database_url = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    
    # Initialize default quiz questions if none exist
    from models.user import Question
    import json
    
    if Question.query.count() == 0:
        default_questions = [
            {
                'question_text': 'Which type of activities do you find most engaging?',
                'category': 'interests',
                'options': [
                    {'value': 'analytical', 'label': 'Analyzing data and solving complex problems'},
                    {'value': 'creative', 'label': 'Creating and designing new things'},
                    {'value': 'social', 'label': 'Working with and helping people'},
                    {'value': 'practical', 'label': 'Building and fixing things with your hands'}
                ]
            },
            {
                'question_text': 'How do you prefer to work?',
                'category': 'personality',
                'options': [
                    {'value': 'team', 'label': 'In a collaborative team environment'},
                    {'value': 'independent', 'label': 'Independently with minimal supervision'},
                    {'value': 'leadership', 'label': 'Leading and directing others'},
                    {'value': 'structured', 'label': 'In a structured, organized setting'}
                ]
            },
            {
                'question_text': 'Which subject area interests you most?',
                'category': 'academic',
                'options': [
                    {'value': 'stem', 'label': 'Science, Technology, Engineering, Math'},
                    {'value': 'humanities', 'label': 'Literature, History, Philosophy'},
                    {'value': 'arts', 'label': 'Visual Arts, Music, Theater'},
                    {'value': 'business', 'label': 'Business, Economics, Finance'}
                ]
            },
            {
                'question_text': 'What is your greatest strength?',
                'category': 'skills',
                'options': [
                    {'value': 'communication', 'label': 'Communication and interpersonal skills'},
                    {'value': 'technical', 'label': 'Technical and analytical abilities'},
                    {'value': 'creativity', 'label': 'Creative thinking and innovation'},
                    {'value': 'organization', 'label': 'Organization and attention to detail'}
                ]
            },
            {
                'question_text': 'What type of work environment appeals to you?',
                'category': 'environment',
                'options': [
                    {'value': 'office', 'label': 'Traditional office setting'},
                    {'value': 'remote', 'label': 'Remote or flexible workspace'},
                    {'value': 'outdoors', 'label': 'Outdoor or field work'},
                    {'value': 'laboratory', 'label': 'Laboratory or research facility'}
                ]
            },
            {
                'question_text': 'What motivates you most in your career?',
                'category': 'values',
                'options': [
                    {'value': 'impact', 'label': 'Making a positive impact on society'},
                    {'value': 'growth', 'label': 'Personal and professional growth'},
                    {'value': 'stability', 'label': 'Job security and stability'},
                    {'value': 'innovation', 'label': 'Innovation and cutting-edge work'}
                ]
            }
        ]
        
        for q_data in default_questions:
            question = Question(
                question_text=q_data['question_text'],
                category=q_data['category'],
                options=json.dumps(q_data['options'])
            )
            db.session.add(question)
        
        db.session.commit()

@app.route('/')
def health_check():
    return jsonify({
        'message': 'AI Career Guidance API is running',
        'status': 'healthy',
        'version': '1.0.0'
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
