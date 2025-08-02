from flask import Blueprint, jsonify, request, session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from models.user import User, db
from middleware.auth import login_required
from schemas.validation import validate_request_data, UserRegistrationSchema, UserLoginSchema
import json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validated_data, errors = validate_request_data(UserRegistrationSchema, data)
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=validated_data['email']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create new user
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            role=validated_data.get('role', 'student')
        )
        user.set_password(validated_data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Store user in session
        session['user_id'] = user.id
        session['user_role'] = user.role
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validated_data, errors = validate_request_data(UserLoginSchema, data)
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        # Find user by email
        user = User.query.filter_by(email=validated_data['email']).first()
        
        if not user or not user.check_password(validated_data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Store user in session
        session['user_id'] = user.id
        session['user_role'] = user.role
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current authenticated user"""
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

