from flask import Blueprint, jsonify, request, session
from models.user import CareerRecommendation, QuizResponse, db
from middleware.auth import login_required, admin_required
import json

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/recommendations', methods=['GET'])
@login_required
def get_user_recommendations():
    """Get current user's career recommendations"""
    try:
        recommendations = CareerRecommendation.query.filter_by(user_id=session['user_id']).order_by(CareerRecommendation.score.desc()).all()
        recommendations_data = []
        for rec in recommendations:
            rec_dict = rec.to_dict()
            # Parse details JSON string back to dict
            if rec_dict['details']:
                rec_dict['details'] = json.loads(rec_dict['details'])
            recommendations_data.append(rec_dict)
        return jsonify(recommendations_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/recommendations/generate', methods=['POST'])
@login_required
def generate_recommendations():
    """Generate career recommendations based on quiz responses"""
    try:
        # Get user's latest quiz response
        response = QuizResponse.query.filter_by(user_id=session['user_id']).order_by(QuizResponse.timestamp.desc()).first()
        
        if not response:
            return jsonify({'error': 'No quiz response found. Please take the quiz first.'}), 400
        
        # Parse answers
        answers = json.loads(response.answers)
        
        # Generate recommendations using enhanced algorithm
        recommendations_data = generate_career_recommendations(answers)
        
        # Delete existing recommendations for this user
        CareerRecommendation.query.filter_by(user_id=session['user_id']).delete()
        
        # Save new recommendations
        for rec_data in recommendations_data:
            recommendation = CareerRecommendation(
                user_id=session['user_id'],
                career=rec_data['career'],
                score=rec_data['score'],
                description=rec_data['description'],
                details=json.dumps(rec_data['details'])
            )
            db.session.add(recommendation)
        
        db.session.commit()
        
        # Return recommendations with parsed details
        final_recommendations = []
        for rec in CareerRecommendation.query.filter_by(user_id=session['user_id']).order_by(CareerRecommendation.score.desc()).all():
            rec_dict = rec.to_dict()
            rec_dict['details'] = json.loads(rec_dict['details'])
            final_recommendations.append(rec_dict)
        
        return jsonify({
            'message': 'Recommendations generated successfully',
            'recommendations': final_recommendations
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def generate_career_recommendations(answers):
    """Enhanced career recommendation algorithm with expanded career database"""
    
    # Expanded career profiles with scoring weights
    careers = {
        'Software Engineer': {
            'analytical': 3, 'technical': 3, 'stem': 3, 'independent': 2, 'innovation': 2, 'remote': 2,
            'description': 'High match based on your analytical skills and interest in technology',
            'details': {
                'overview': 'Software engineers design, develop, and maintain software applications and systems.',
                'skills': ['Programming', 'Problem Solving', 'System Design', 'Testing', 'Debugging'],
                'education': "Bachelor's degree in Computer Science or related field",
                'salary': '$85,000 - $150,000',
                'outlook': 'Excellent - 22% growth expected',
                'workEnvironment': 'Office or remote, collaborative team environment'
            }
        },
        'Data Scientist': {
            'analytical': 3, 'technical': 3, 'stem': 3, 'structured': 2, 'growth': 2, 'innovation': 2,
            'description': 'Strong alignment with your mathematical aptitude and problem-solving abilities',
            'details': {
                'overview': 'Data scientists analyze complex data to help organizations make informed decisions.',
                'skills': ['Statistics', 'Machine Learning', 'Python/R', 'Data Visualization', 'SQL'],
                'education': "Bachelor's or Master's degree in Data Science, Statistics, or related field",
                'salary': '$95,000 - $165,000',
                'outlook': 'Very Good - 35% growth expected',
                'workEnvironment': 'Office setting, often working with cross-functional teams'
            }
        },
        'UX Designer': {
            'creative': 3, 'communication': 2, 'arts': 3, 'team': 2, 'innovation': 2, 'creativity': 3,
            'description': 'Good fit for your creative thinking and user-focused mindset',
            'details': {
                'overview': 'UX designers create intuitive and engaging user experiences for digital products.',
                'skills': ['Design Thinking', 'Prototyping', 'User Research', 'Wireframing', 'Adobe Creative Suite'],
                'education': "Bachelor's degree in Design, Psychology, or related field",
                'salary': '$70,000 - $130,000',
                'outlook': 'Good - 13% growth expected',
                'workEnvironment': 'Creative studio or office environment, collaborative work'
            }
        },
        'Product Manager': {
            'leadership': 3, 'communication': 3, 'business': 3, 'team': 2, 'growth': 2, 'analytical': 2,
            'description': 'Matches your leadership potential and strategic thinking',
            'details': {
                'overview': 'Product managers guide the development and strategy of products from conception to launch.',
                'skills': ['Strategic Planning', 'Communication', 'Market Analysis', 'Project Management', 'Agile'],
                'education': "Bachelor's degree in Business, Engineering, or related field",
                'salary': '$100,000 - $180,000',
                'outlook': 'Very Good - 19% growth expected',
                'workEnvironment': 'Office setting, leading cross-functional teams'
            }
        },
        'Cybersecurity Analyst': {
            'analytical': 2, 'technical': 3, 'stem': 2, 'organization': 3, 'stability': 2, 'structured': 2,
            'description': 'Aligns with your analytical skills and attention to detail',
            'details': {
                'overview': 'Cybersecurity analysts protect organizations from digital threats and security breaches.',
                'skills': ['Security Protocols', 'Risk Assessment', 'Incident Response', 'Network Security', 'Ethical Hacking'],
                'education': "Bachelor's degree in Cybersecurity, Computer Science, or related field",
                'salary': '$80,000 - $140,000',
                'outlook': 'Excellent - 33% growth expected',
                'workEnvironment': 'Office or remote, often working in security operations centers'
            }
        },
        'Marketing Manager': {
            'communication': 3, 'creative': 2, 'business': 3, 'team': 2, 'leadership': 2, 'social': 2,
            'description': 'Perfect for your communication skills and business acumen',
            'details': {
                'overview': 'Marketing managers develop and execute marketing strategies to promote products and services.',
                'skills': ['Digital Marketing', 'Brand Management', 'Analytics', 'Content Strategy', 'Social Media'],
                'education': "Bachelor's degree in Marketing, Business, or related field",
                'salary': '$75,000 - $135,000',
                'outlook': 'Good - 10% growth expected',
                'workEnvironment': 'Office setting, collaborative and creative environment'
            }
        },
        'Financial Analyst': {
            'analytical': 3, 'business': 3, 'organization': 3, 'structured': 2, 'stability': 2, 'technical': 2,
            'description': 'Excellent match for your analytical and organizational skills',
            'details': {
                'overview': 'Financial analysts evaluate investment opportunities and provide financial guidance.',
                'skills': ['Financial Modeling', 'Excel', 'Data Analysis', 'Risk Assessment', 'Forecasting'],
                'education': "Bachelor's degree in Finance, Economics, or related field",
                'salary': '$70,000 - $125,000',
                'outlook': 'Good - 6% growth expected',
                'workEnvironment': 'Office setting, often working with financial data and reports'
            }
        },
        'Graphic Designer': {
            'creative': 3, 'arts': 3, 'creativity': 3, 'independent': 2, 'innovation': 2, 'technical': 1,
            'description': 'Great fit for your artistic and creative abilities',
            'details': {
                'overview': 'Graphic designers create visual concepts to communicate ideas and inspire audiences.',
                'skills': ['Adobe Creative Suite', 'Typography', 'Branding', 'Layout Design', 'Color Theory'],
                'education': "Bachelor's degree in Graphic Design, Art, or related field",
                'salary': '$45,000 - $85,000',
                'outlook': 'Average - 3% growth expected',
                'workEnvironment': 'Creative studio, agency, or freelance work'
            }
        },
        'Teacher': {
            'communication': 3, 'social': 3, 'humanities': 3, 'impact': 3, 'team': 2, 'organization': 2,
            'description': 'Ideal for your passion for helping others and communication skills',
            'details': {
                'overview': 'Teachers educate students in various subjects and help them develop critical thinking skills.',
                'skills': ['Curriculum Development', 'Classroom Management', 'Communication', 'Assessment', 'Technology Integration'],
                'education': "Bachelor's degree in Education or subject area, plus teaching certification",
                'salary': '$40,000 - $70,000',
                'outlook': 'Good - 8% growth expected',
                'workEnvironment': 'School setting, working with students and colleagues'
            }
        },
        'Research Scientist': {
            'analytical': 3, 'stem': 3, 'technical': 3, 'independent': 2, 'innovation': 3, 'laboratory': 3,
            'description': 'Perfect match for your scientific curiosity and analytical mindset',
            'details': {
                'overview': 'Research scientists conduct experiments and studies to advance knowledge in their field.',
                'skills': ['Research Methods', 'Data Analysis', 'Scientific Writing', 'Laboratory Techniques', 'Statistical Analysis'],
                'education': "Master's or PhD in relevant scientific field",
                'salary': '$80,000 - $140,000',
                'outlook': 'Good - 8% growth expected',
                'workEnvironment': 'Laboratory or research facility, often independent work'
            }
        }
    }
    
    # Calculate scores for each career using improved algorithm
    career_scores = []
    
    for career, weights in careers.items():
        score = 0
        max_score = 0
        match_count = 0
        
        for trait, weight in weights.items():
            if trait in ['description', 'details']:
                continue
            max_score += weight * 3  # Maximum possible score per trait
            
            # Check if user's answers match this trait
            for answer_id, answer_value in answers.items():
                if answer_value == trait:
                    score += weight * 3
                    match_count += 1
                elif trait in str(answer_value):  # Partial match
                    score += weight * 1.5
                    match_count += 0.5
        
        # Apply bonus for multiple matches (synergy bonus)
        if match_count >= 3:
            score *= 1.2
        elif match_count >= 2:
            score *= 1.1
        
        # Normalize score to percentage
        if max_score > 0:
            percentage_score = min(100, (score / max_score) * 100)
        else:
            percentage_score = 50  # Default score
        
        # Ensure minimum variance in scores
        if percentage_score < 30:
            percentage_score = max(30, percentage_score + (match_count * 5))
        
        career_scores.append({
            'career': career,
            'score': round(percentage_score, 1),
            'description': weights['description'],
            'details': weights['details']
        })
    
    # Sort by score and return top 8
    career_scores.sort(key=lambda x: x['score'], reverse=True)
    return career_scores[:8]

@recommendations_bp.route('/recommendations/all', methods=['GET'])
@admin_required
def get_all_recommendations():
    """Get all recommendations (admin only)"""
    try:
        recommendations = CareerRecommendation.query.all()
        recommendations_data = []
        for rec in recommendations:
            rec_dict = rec.to_dict()
            if rec_dict['details']:
                rec_dict['details'] = json.loads(rec_dict['details'])
            recommendations_data.append(rec_dict)
        return jsonify(recommendations_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

