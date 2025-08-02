# AI Career Guidance System - Setup Instructions

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd career-guidance-backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your preferred settings
# The default values should work for development
```

4. Initialize the database:
```bash
python main.py
```
This will create the SQLite database and populate it with default quiz questions.

5. Run the backend server:
```bash
python main.py
```
The backend will be available at `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd career-guidance-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

## Testing the Integration

### 1. User Registration & Authentication
- Visit `http://localhost:5173`
- Click "Get Started" to register a new account
- Fill in the registration form (use role: "student" for normal users)
- Verify successful login and redirect to dashboard

### 2. Career Quiz
- From the dashboard, click "Start Career Assessment"
- Complete all 6 quiz questions
- Verify successful submission and redirect to recommendations

### 3. Career Recommendations
- View the generated career recommendations
- Click on different careers to see detailed information
- Verify that recommendations are personalized based on quiz answers

### 4. Dashboard Features
- Return to dashboard to see quiz completion status
- View top 3 recommendations summary
- Test logout functionality

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Quiz
- `GET /api/quiz/questions` - Get all quiz questions
- `POST /api/quiz/responses` - Submit quiz responses
- `GET /api/quiz/responses` - Get user's quiz responses

### Recommendations
- `GET /api/recommendations` - Get user's recommendations
- `POST /api/recommendations/generate` - Generate new recommendations

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get user's feedback

## Security Features Implemented

1. **Environment Configuration**: Sensitive data moved to environment variables
2. **Input Validation**: Marshmallow schemas for request validation
3. **Authentication Middleware**: Decorators for protected routes
4. **Password Hashing**: Werkzeug for secure password storage
5. **Session Security**: Secure session configuration
6. **CORS Configuration**: Proper cross-origin resource sharing setup
7. **Rate Limiting**: Basic rate limiting on API endpoints

## Enhanced Features

1. **Expanded Career Database**: 10 different career options with detailed information
2. **Improved Recommendation Algorithm**: Enhanced scoring with synergy bonuses
3. **Real-time Data**: All components now fetch live data from backend
4. **Error Handling**: Comprehensive error handling and user feedback
5. **Loading States**: Proper loading indicators throughout the application

## Troubleshooting

### Backend Issues
- Ensure Python dependencies are installed: `pip install -r requirements.txt`
- Check if port 5000 is available
- Verify database file is created in `database/app.db`

### Frontend Issues
- Ensure Node.js dependencies are installed: `npm install`
- Check if port 5173 is available
- Verify backend is running and accessible

### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Check `.env` file for correct CORS_ORIGINS setting

### Database Issues
- Delete `database/app.db` and restart backend to recreate database
- Check file permissions in the database directory