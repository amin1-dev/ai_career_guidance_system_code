from flask import Blueprint, jsonify, request, session
from models.user import Feedback, db
from middleware.auth import login_required, admin_required
from schemas.validation import validate_request_data, FeedbackSchema

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedback', methods=['POST'])
@login_required
def submit_feedback():
    """Submit user feedback"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validated_data, errors = validate_request_data(FeedbackSchema, data)
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        feedback = Feedback(
            user_id=session['user_id'],
            message=validated_data['message']
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback': feedback.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@feedback_bp.route('/feedback', methods=['GET'])
@login_required
def get_user_feedback():
    """Get current user's feedback"""
    try:
        feedback_list = Feedback.query.filter_by(user_id=session['user_id']).order_by(Feedback.date.desc()).all()
        return jsonify([feedback.to_dict() for feedback in feedback_list]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@feedback_bp.route('/feedback/all', methods=['GET'])
@admin_required
def get_all_feedback():
    """Get all feedback (admin only)"""
    try:
        feedback_list = Feedback.query.order_by(Feedback.date.desc()).all()
        return jsonify([feedback.to_dict() for feedback in feedback_list]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@feedback_bp.route('/feedback/<int:feedback_id>', methods=['DELETE'])
@admin_required
def delete_feedback(feedback_id):
    """Delete feedback (admin only)"""
    try:
        feedback = Feedback.query.get_or_404(feedback_id)
        db.session.delete(feedback)
        db.session.commit()
        
        return jsonify({'message': 'Feedback deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

