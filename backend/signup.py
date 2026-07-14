from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from passlib.hash import sha256_crypt
import json
import os

signup_bp = Blueprint('signup', __name__)

MONGO_URI = "mongodb+srv://aiannotattiontoll:f0KKe0jyVzzC8zas@cluster.5rjqpuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))
LOCAL_USERS_FILE = os.path.join(BACKEND_DIR, 'users.json')

client = None
db = None
users_collection = None


def _load_local_users():
    if os.path.exists(LOCAL_USERS_FILE):
        try:
            with open(LOCAL_USERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []
    return []


def _save_local_users(users):
    with open(LOCAL_USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2)


try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client['annotation_tool']
    users_collection = db['users']
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Warning: Could not connect to MongoDB: {e}")
    print("Running in offline mode - signups will be stored locally")


@signup_bp.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json(force=True) or {}
        print("Received data:", data)

        required_fields = ['firstName', 'lastName', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400

        if users_collection is not None:
            existing_user = users_collection.find_one({'email': data['email']})
            if existing_user:
                return jsonify({'success': False, 'message': 'Email already registered'}), 400

            password = data['password']
            hashed_password = sha256_crypt.hash(password)
            users_collection.insert_one({
                'firstName': data['firstName'],
                'lastName': data['lastName'],
                'email': data['email'],
                'password': hashed_password
            })
            return jsonify({'success': True, 'message': 'User created successfully'}), 200

        users = _load_local_users()
        if any(user.get('email') == data['email'] for user in users):
            return jsonify({'success': False, 'message': 'Email already registered'}), 400

        password = data['password']
        hashed_password = sha256_crypt.hash(password)
        users.append({
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'email': data['email'],
            'password': hashed_password
        })
        _save_local_users(users)

        return jsonify({'success': True, 'message': 'User created successfully'}), 200

    except Exception as e:
        print("Signup Error:", str(e))
        return jsonify({'success': False, 'message': 'Internal server error'}), 500


# YXvNKcFIS1HsXxT2