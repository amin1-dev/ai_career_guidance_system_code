from marshmallow import Schema, fields, validate, ValidationError

class UserRegistrationSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6, max=128))
    role = fields.Str(validate=validate.OneOf(['student', 'admin']), missing='student')

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class QuizResponseSchema(Schema):
    answers = fields.Dict(required=True, validate=validate.Length(min=1))

class FeedbackSchema(Schema):
    message = fields.Str(required=True, validate=validate.Length(min=10, max=1000))

class QuestionSchema(Schema):
    question_text = fields.Str(required=True, validate=validate.Length(min=10, max=500))
    category = fields.Str(required=True, validate=validate.Length(min=2, max=50))
    options = fields.List(fields.Dict(), required=True, validate=validate.Length(min=2))

def validate_request_data(schema_class, data):
    """Validate request data using the provided schema"""
    schema = schema_class()
    try:
        result = schema.load(data)
        return result, None
    except ValidationError as err:
        return None, err.messages