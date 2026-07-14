# login.py
from flask import Blueprint, request, jsonify, session
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import check_password_hash
import os
from passlib.hash import sha256_crypt

login_bp = Blueprint('login', __name__)

# Initialize MongoDB connection as None
client = None
db = None
users_collection = None

try:
    # Try to connect to MongoDB
    client = MongoClient(
        "mongodb+srv://aiannotattiontoll:f0KKe0jyVzzC8zas@cluster.5rjqpuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster",
        serverSelectionTimeoutMS=5000  # 5 second timeout
    )
    # Test the connection
    client.server_info()
    db = client['annotation_tool']
    users_collection = db['users']
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Warning: Could not connect to MongoDB: {e}")
    print("Running in offline mode - authentication will be disabled")


@login_bp.route('/api/login', methods=['POST'])
def login():
    # Always use offline mode for now
    data = request.get_json()
    username = data.get('username', 'demo')
    return jsonify({
        'message': 'Login successful (offline mode)',
        'user': {
            'id': 'demo_user_id',
            'username': username
        }
    }), 200
        
    # Normal login flow when MongoDB is available
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    try:
        user = users_collection.find_one({'username': username})
        
        if user and sha256_crypt.verify(password, user['password']):
            # Generate a session token
            session['user_id'] = str(user['_id'])
            session['username'] = username
            
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': str(user['_id']),
                    'username': username
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'error': 'Database error during login'}), 500
