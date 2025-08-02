from flask import Blueprint, jsonify, request, session
from models.user import Question, QuizResponse, db
from middleware.auth import login_required, admin_required
from schemas.validation import validate_request_data, QuizResponseSchema, QuestionSchema
import json

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/questions', methods=['GET'])
def get_questions():
    """Get all quiz questions"""
    try:
        questions = Question.query.all()
        questions_data = []
        for question in questions:
            question_dict = question.to_dict()
            # Parse options JSON string back to list
            question_dict['options'] = json.loads(question_dict['options'])
            questions_data.append(question_dict)
        return jsonify(questions_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quiz_bp.route('/questions', methods=['POST'])
@admin_required
def create_question():
    """Create a new quiz question (admin only)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validated_data, errors = validate_request_data(QuestionSchema, data)
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        question = Question(
            question_text=validated_data['question_text'],
            category=validated_data['category'],
            options=json.dumps(validated_data['options'])
        )
        
        db.session.add(question)
        db.session.commit()
        
        question_dict = question.to_dict()
        question_dict['options'] = json.loads(question_dict['options'])
        
        return jsonify({
            'message': 'Question created successfully',
            'question': question_dict
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quiz_bp.route('/responses', methods=['POST'])
@login_required
def submit_quiz_response():
    """Submit quiz responses"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validated_data, errors = validate_request_data(QuizResponseSchema, data)
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        # Delete previous responses for this user
        QuizResponse.query.filter_by(user_id=session['user_id']).delete()
        
        # Create new response
        response = QuizResponse(
            user_id=session['user_id'],
            answers=json.dumps(validated_data['answers'])
        )
        
        db.session.add(response)
        db.session.commit()
        
        return jsonify({
            'message': 'Quiz response submitted successfully',
            'response': response.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quiz_bp.route('/responses', methods=['GET'])
@login_required
def get_user_responses():
    """Get current user's quiz responses"""
    try:
        responses = QuizResponse.query.filter_by(user_id=session['user_id']).all()
        return jsonify([response.to_dict() for response in responses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quiz_bp.route('/responses/all', methods=['GET'])
@admin_required
def get_all_responses():
    """Get all quiz responses (admin only)"""
    try:
        responses = QuizResponse.query.all()
        return jsonify([response.to_dict() for response in responses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quiz_bp.route('/questions/<int:question_id>', methods=['DELETE'])
@admin_required
def delete_question(question_id):
    """Delete a quiz question (admin only)"""
    try:
        question = Question.query.get_or_404(question_id)
        db.session.delete(question)
        db.session.commit()
        return jsonify({'message': 'Question deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

