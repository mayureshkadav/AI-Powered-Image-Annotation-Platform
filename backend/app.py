# from flask import Flask
# from flask_cors import CORS
# from login import login_bp


# app = Flask(__name__)
# CORS(app)

# # Register the login blueprint
# app.register_blueprint(login_bp)

# @app.route("/")
# def home():
#     return {"message": "Welcome to the AI Annotation Backend"}

# if __name__ == "__main__":
#     app.run(debug=True)


# app.py
import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from login import login_bp
from signup import signup_bp
from create_project import create_project_bp
from get_projects import get_projects_bp
from save_annotations import save_annotations_bp
from ai_annotation import ai_annotation_bp

app = Flask(__name__, static_url_path='')
app.secret_key = 'your-secret-key-here'  # Change this to a secure secret key in production
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # For HTTPS only

# Configure CORS to allow all origins for all routes
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Add headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Serve uploaded files
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

# Register blueprints
app.register_blueprint(login_bp)
app.register_blueprint(signup_bp)
app.register_blueprint(create_project_bp)
app.register_blueprint(get_projects_bp)
app.register_blueprint(save_annotations_bp)
app.register_blueprint(ai_annotation_bp)

# Serve React App (Vite build output)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Path to your Vite build output directory
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ai-tool', 'dist'))
    
    # If the path exists in the static directory, serve it
    if path != "" and os.path.exists(os.path.join(static_dir, path)):
        return send_from_directory(static_dir, path)
    # Otherwise, serve index.html for client-side routing
    else:
        return send_from_directory(static_dir, 'index.html')

if __name__ == '__main__':
    # Ensure the static folder exists
    if not os.path.exists('static'):
        os.makedirs('static')
    app.run(host='0.0.0.0', port=5000, debug=False)
