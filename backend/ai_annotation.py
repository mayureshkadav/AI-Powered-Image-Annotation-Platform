# ai_annotation.py
import os
from flask import Blueprint, request, jsonify

ai_annotation_bp = Blueprint('ai_annotation', __name__)

# Global model cache
MODEL_CACHE = {}
DEFAULT_MODEL = 'yolov8m.pt'
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')

def _get_available_models():
    """List all available .pt model files in the model directory."""
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR, exist_ok=True)
        return []
    return [f for f in os.listdir(MODEL_DIR) if f.endswith('.pt')]

def _get_model_path(model_name=None):
    """Get the full path to a model file."""
    if not model_name:
        model_name = DEFAULT_MODEL
    return os.path.join(MODEL_DIR, model_name)

def _load_model(model_name=None):
    """Load a YOLO model by name, using cache if available."""
    if not model_name:
        model_name = DEFAULT_MODEL
    
    # Return cached model if available
    if model_name in MODEL_CACHE:
        return MODEL_CACHE[model_name]['model']
    
    try:
        from ultralytics import YOLO
    except Exception as e:
        raise RuntimeError(
            "Ultralytics YOLO is not installed. Please install with 'pip install ultralytics' in the backend environment."
        ) from e

    model_path = _get_model_path(model_name)
    if not os.path.exists(model_path):
        available = _get_available_models()
        raise FileNotFoundError(
            f"Model '{model_name}' not found at: {model_path}"
            f"\nAvailable models: {', '.join(available) if available else 'No models found'}"
        )

    try:
        model = YOLO(model_path)
        # Get class names
        names = {int(k): v for k, v in model.names.items()} if isinstance(model.names, dict) else {
            i: name for i, name in enumerate(model.names)
        }
        
        # Cache the model and its metadata
        MODEL_CACHE[model_name] = {
            'model': model,
            'names': names,
            'path': model_path
        }
        
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load model '{model_name}': {str(e)}") from e


@ai_annotation_bp.route('/available-models', methods=['GET'])
def available_models():
    """Return the list of available YOLO models."""
    try:
        models = _get_available_models()
        return jsonify({
            "models": models,
            "default": DEFAULT_MODEL if models else None
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_annotation_bp.route('/model-classes', methods=['GET'])
def model_classes():
    """Return the list of class names supported by the specified YOLO model."""
    model_name = request.args.get('model')
    try:
        model = _load_model(model_name)
        model_data = MODEL_CACHE.get(model_name or DEFAULT_MODEL, {})
        names = model_data.get('names', {})
        class_list = [names[i] for i in sorted(names.keys())] if names else []
        return jsonify({
            "classes": class_list,
            "model": model_name or DEFAULT_MODEL
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ai_annotation_bp.route('/ai-annotate', methods=['POST'])
def ai_annotate():
    """
    Request JSON:
    {
      "project_name": "my_project",
      "image_name": "image.jpg",
      "class_name": "person",  # selected class name from UI
      "model_name": "yolov8m.pt"  # optional, defaults to default model
    }

    Response JSON:
    { 
      "annotations": [ { x_center, y_center, width, height, class } ... ],
      "model": "model_name.pt"
    }
    All values are normalized (0..1) in YOLO format.
    """
    data = request.get_json(silent=True) or {}
    project_name = data.get('project_name')
    image_name = data.get('image_name')
    class_name = data.get('class_name')
    model_name = data.get('model_name')

    if not project_name or not image_name or not class_name:
        return jsonify({"error": "project_name, image_name, and class_name are required"}), 400

    # Resolve local image path: backend/uploads/<project>/<image>
    safe_project = project_name.replace(' ', '_')
    img_path = os.path.join(os.path.dirname(__file__), 'uploads', safe_project, image_name)
    if not os.path.exists(img_path):
        return jsonify({"error": f"Image not found at {img_path}"}), 404

    try:
        model = _load_model(model_name)
        model_data = MODEL_CACHE.get(model_name or DEFAULT_MODEL, {})
        model_names = model_data.get('names', {})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Verify image is readable and run inference
    try:
        try:
            import cv2
        except ImportError:
            cv2 = None

        img_for_infer = None
        if cv2 is not None:
            img_for_infer = cv2.imread(img_path)
            if img_for_infer is None:
                return jsonify({"error": f"Failed to read image with OpenCV at: {img_path}"}), 400
        # If OpenCV not available, fallback to path-based inference
        results = model(img_for_infer if img_for_infer is not None else img_path)
    except Exception as e:
        return jsonify({"error": f"Inference failed: {e}"}), 500

    # Find model class id for requested name (case-insensitive)
    target_cls_id = None
    lower = class_name.strip().lower()
    for cid, cname in (model_names or {}).items():
        if str(cname).strip().lower() == lower:
            target_cls_id = cid
            break

    if target_cls_id is None:
        return jsonify({
            "error": f"Class '{class_name}' not found in model '{model_name or DEFAULT_MODEL}'"
        }), 400

    anns = []
    try:
        # Ultralytics returns a list of results, take first
        r0 = results[0]
        if r0.boxes is not None and len(r0.boxes) > 0:
            # xyxyn are normalized xyxy
            import torch
            xyxyn = r0.boxes.xyxyn.detach().cpu().numpy()
            clses = r0.boxes.cls.detach().cpu().numpy()
            confs = r0.boxes.conf.detach().cpu().numpy() if hasattr(r0.boxes, 'conf') else None

            for i in range(xyxyn.shape[0]):
                cls_id = int(clses[i])
                if cls_id != target_cls_id:
                    continue
                x1, y1, x2, y2 = xyxyn[i].tolist()
                # Convert xyxy -> cx, cy, w, h (normalized)
                w = max(0.0, x2 - x1)
                h = max(0.0, y2 - y1)
                cx = x1 + w / 2
                cy = y1 + h / 2
                ann = {
                    'class': class_name,
                    'x_center': float(cx),
                    'y_center': float(cy),
                    'width': float(w),
                    'height': float(h),
                }
                if confs is not None:
                    ann['confidence'] = float(confs[i])
                anns.append(ann)
    except Exception as e:
        return jsonify({"error": f"Failed to parse model output: {e}"}), 500

    return jsonify({
        "annotations": anns,
        "model": model_name or DEFAULT_MODEL
    })
