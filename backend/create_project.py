from flask import Blueprint, request, jsonify
import os
import json
import random
from datetime import datetime

create_project_bp = Blueprint('create_project', __name__)

# Get the absolute path of the directory where this script is located
BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))

# Define paths relative to the backend directory
UPLOAD_FOLDER = os.path.join(BACKEND_DIR, 'uploads')
PROJECT_FOLDER = os.path.join(BACKEND_DIR, 'projects')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROJECT_FOLDER, exist_ok=True)

@create_project_bp.route('/create-project', methods=['POST'])
def create_project():
    data = request.form.to_dict()
    project_name = data.get('projectName', '').strip()
    description = data.get('projectDescription', '').strip()
    raw_classes = data.get('annotationClasses', '').strip()
    label_mode = data.get('labelMode', 'labelMyself')

    # Define a list of distinct colors
    COLORS = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA", "#F0C419", 
        "#FF5733", "#C70039", "#900C3F", "#581845", "#FFC300", "#DAF7A6",
        "#FFC0CB", "#00FFFF", "#FF00FF", "#0000FF", "#00FF00", "#FFFF00"
    ]

    # Parse classes from the input string
    class_names = []
    # First, split by newlines to handle multi-line input
    lines = raw_classes.split('\n')
    for line in lines:
        # For each line, split by commas and add each class
        for cls in line.split(','):
            cls = cls.strip()
            if cls:  # Only add non-empty strings
                class_names.append(cls)
    
    # Create annotation classes with unique colors
    annotation_classes = [
        {"name": name, "color": COLORS[i % len(COLORS)]} 
        for i, name in enumerate(class_names)
    ]

    if not project_name:
        return jsonify({'error': 'Project name is required'}), 400

    files = request.files.getlist('files')
    saved_files = []
    project_upload_dir = os.path.join(UPLOAD_FOLDER, project_name.replace(" ", "_"))
    os.makedirs(project_upload_dir, exist_ok=True)

    for file in files:
        filename = file.filename
        filepath = os.path.join(project_upload_dir, filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        file.save(filepath)
        saved_files.append(filename)

    # ✅ JSON metadata saving
    project_data = {
        'projectName': project_name,
        'description': description,
        'annotationClasses': annotation_classes,
        'labelMode': label_mode,
        'uploadedFiles': saved_files,
        'createdAt': datetime.utcnow().isoformat(),
        'imageCount': len(saved_files),
        'projectDirectory': project_upload_dir,
        'status': 'active'  # Default status
    }

    try:
        json_path = os.path.join(PROJECT_FOLDER, f"{project_name.replace(' ', '_')}.json")
        with open(json_path, 'w') as f:
            json.dump(project_data, f, indent=4)
        print(f"[✅] Metadata saved to {json_path}")
    except Exception as e:
        print(f"[❌] Failed to save metadata JSON: {e}")

    return jsonify({'message': 'Project saved successfully', 'data': project_data})
