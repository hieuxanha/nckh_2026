from flask import Blueprint, jsonify, request
from app.models.model_version import ModelVersion
from app import db
from flask_jwt_extended import jwt_required

model_bp = Blueprint('models', __name__)


@model_bp.route('/list', methods=['GET'])
@jwt_required()
def list_models():
    models = ModelVersion.query.order_by(ModelVersion.created_at.desc()).all()
    return jsonify([m.to_dict() for m in models]), 200


@model_bp.route('/evaluate/<int:model_id>', methods=['POST'])
@jwt_required()
def evaluate(model_id):
    model_data = ModelVersion.query.get_or_404(model_id)

    # Ở đây Hiếu có thể viết logic load mô hình thật và chạy inference
    # Hoặc trả về kết quả đánh giá đã lưu sẵn trong DB từ lúc huấn luyện
    return jsonify({
        "accuracy": model_data.accuracy,
        "precision": model_data.precision,
        "recall": model_data.recall,
        "f1_score": model_data.f1_score,
        "confusion_matrix": {
            "tn": model_data.tn, "fp": model_data.fp,
            "fn": model_data.fn, "tp": model_data.tp
        }
    }), 200


@model_bp.route('/set-active/<int:model_id>', methods=['PUT'])
@jwt_required()
def set_active(model_id):
    # Tắt tất cả các model khác
    ModelVersion.query.update({ModelVersion.status: 'Inactive'})
    # Kích hoạt model này
    target = ModelVersion.query.get(model_id)
    target.status = 'Active'
    db.session.commit()
    return jsonify({"message": f"Mô hình {target.name} hiện đã được đưa vào sử dụng!"}), 200