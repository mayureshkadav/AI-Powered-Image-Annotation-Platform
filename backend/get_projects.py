from flask import Blueprint, jsonify, send_from_directory
import os
import json
import shutil

get_projects_bp = Blueprint('get_projects', __name__)
PROJECT_FOLDER = 'projects'
UPLOAD_FOLDER = 'uploads'

@get_projects_bp.route('/get-projects', methods=['GET'])
def get_projects():
    projects = []
    if os.path.exists(PROJECT_FOLDER):
        for filename in os.listdir(PROJECT_FOLDER):
            if filename.endswith('.json'):
                filepath = os.path.join(PROJECT_FOLDER, filename)
                with open(filepath, 'r') as f:
                    try:
                        project_data = json.load(f)
                        projects.append(project_data)
                    except json.JSONDecodeError:
                        print(f"Error decoding JSON from {filename}")
    return jsonify(projects)

@get_projects_bp.route('/get-project/<project_name>', methods=['GET'])
def get_project(project_name):
    project_filename = f"{project_name.replace(' ', '_')}.json"
    project_filepath = os.path.join(PROJECT_FOLDER, project_filename)

    if os.path.exists(project_filepath):
        with open(project_filepath, 'r') as f:
            try:
                project_data = json.load(f)
                return jsonify(project_data)
            except json.JSONDecodeError:
                return jsonify({'error': 'Error decoding project JSON'}), 500
    return jsonify({'error': 'Project not found'}), 404

@get_projects_bp.route('/get-project-images/<project_name>', methods=['GET'])
def get_project_images(project_name):
    project_upload_dir = os.path.join(UPLOAD_FOLDER, project_name.replace(" ", "_"))
    if os.path.exists(project_upload_dir):
        images = [f for f in os.listdir(project_upload_dir) if os.path.isfile(os.path.join(project_upload_dir, f))]
        # Return URLs instead of just filenames
        image_urls = [f'uploads/{project_name.replace(" ", "_")}/{image}' for image in images]
        return jsonify({'image_paths': image_urls})
    return jsonify({'image_paths': []})

@get_projects_bp.route('/uploads/<project_name>/<filename>')
def send_image(project_name, filename):
    return send_from_directory(os.path.join(UPLOAD_FOLDER, project_name), filename)

@get_projects_bp.route('/delete-project/<project_name>', methods=['DELETE'])
def delete_project(project_name):
    project_filename = f"{project_name.replace(' ', '_')}.json"
    project_filepath = os.path.join(PROJECT_FOLDER, project_filename)
    project_upload_dir = os.path.join(UPLOAD_FOLDER, project_name.replace(' ', '_'))

    try:
        if os.path.exists(project_filepath):
            os.remove(project_filepath)
        
        if os.path.exists(project_upload_dir):
            shutil.rmtree(project_upload_dir)
            
        return jsonify({'message': 'Project deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
