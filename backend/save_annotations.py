import os
from flask import Blueprint, request, jsonify
import json

save_annotations_bp = Blueprint('save_annotations', __name__)

@save_annotations_bp.route('/save-annotations', methods=['POST'])
def save_annotations():
    try:
        data = request.json
        project_name = data.get('project_name')
        image_name = data.get('image_name')
        annotations = data.get('annotations', [])
        
        if not project_name or not image_name:
            return jsonify({"error": "Project name and image name are required"}), 400
        
        # Create project directory if it doesn't exist
        project_dir = os.path.join('uploads', project_name)
        os.makedirs(project_dir, exist_ok=True)
        
        # Save annotations to a .txt file with the same name as the image
        txt_filename = os.path.splitext(image_name)[0] + '.txt'
        txt_path = os.path.join(project_dir, txt_filename)
        
        # Format annotations as YOLO format
        yolo_annotations = []
        for ann in annotations:
            yolo_annotations.append(
                f"{ann.get('class_id', 0)} "
                f"{ann.get('x_center', 0):.6f} "
                f"{ann.get('y_center', 0):.6f} "
                f"{ann.get('width', 0):.6f} "
                f"{ann.get('height', 0):.6f}"
            )
        
        # Write to file
        with open(txt_path, 'w') as f:
            f.write('\n'.join(yolo_annotations))
        
        return jsonify({"message": "Annotations saved successfully", "path": txt_path})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
