import os
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from app import db
from app.models.analysis import Analysis
from app.models.user import User

# Định nghĩa một Blueprint riêng cho các tính năng bổ trợ
feature_bp = Blueprint('feature', __name__)

def get_current_user_id():
    identity = get_jwt_identity()
    try:
        return int(identity)
    except (ValueError, TypeError):
        user = User.query.filter_by(email=identity).first()
        return user.id if user else None


# ---------------------------------------------------------
# API: LẤY THỐNG KÊ DASHBOARD
# ---------------------------------------------------------
@feature_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_analysis_stats():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"msg": "Người dùng không tồn tại hoặc token hết hạn"}), 401

    user = User.query.get(user_id)
    is_admin = user and user.role == 'admin'

    query = Analysis.query
    if not is_admin:
        query = query.filter_by(user_id=user_id)

    all_records = query.with_entities(Analysis.result).all()

    total = len(all_records)
    pneumonia = sum(1 for rec in all_records if rec.result == 'Viêm phổi')
    pos_rate = (pneumonia / total * 100) if total > 0 else 0

    return jsonify({
        "total": total,
        "pneumonia": pneumonia,
        "positive_rate": f"{pos_rate:.1f}%",
        "ai_version": "v2.4.1"
    }), 200


# ---------------------------------------------------------
# API: LẤY DANH SÁCH LỊCH SỬ
# ---------------------------------------------------------
@feature_bp.route('/list', methods=['GET'])
@jwt_required()
def get_analysis_list():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"msg": "Quyền truy cập bị từ chối"}), 401

    user = User.query.get(user_id)
    is_admin = user and user.role == 'admin'

    search = request.args.get('search', '').strip()
    limit = request.args.get('limit', type=int)

    if is_admin:
        query = Analysis.query.options(joinedload(Analysis.user))
    else:
        query = Analysis.query.filter_by(user_id=user_id)

    if search:
        query = query.filter(or_(
            Analysis.patient_name.like(f'%{search}%'),
            Analysis.patient_id.like(f'%{search}%')
        ))

    query = query.order_by(Analysis.created_at.desc())
    results = query.limit(limit).all() if limit else query.all()

    return jsonify([item.to_dict() for item in results]), 200


# ---------------------------------------------------------
# API: XÓA HỒ SƠ BỆNH ÁN
# ---------------------------------------------------------
@feature_bp.route('/delete/<id>', methods=['DELETE'])
@jwt_required()
def delete_record(id):
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"status": "error", "msg": "Phiên làm việc hết hạn"}), 401

    try:
        user = User.query.get(user_id)
        is_admin = user and user.role == 'admin'

        record = Analysis.query.filter(
            (Analysis.id == id) | (Analysis.patient_id == id)
        ).first()

        if not record:
            return jsonify({"status": "error", "msg": "Không tìm thấy hồ sơ bệnh án này trong hệ thống"}), 404

        if not is_admin and record.user_id != user_id:
            return jsonify({
                "status": "error",
                "msg": "Hành động bị từ chối! Bạn không có quyền xóa hồ sơ bệnh án của bác sĩ khác."
            }), 403

        # Dọn dẹp file vật lý tránh rác ổ cứng server
        for path in [record.image_path, record.heatmap_path]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass

        db.session.delete(record)
        db.session.commit()

        return jsonify({"status": "success", "msg": "Đã loại bỏ hồ sơ bệnh án và dữ liệu ảnh liên quan thành công!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "msg": f"Lỗi đồng bộ cơ sở dữ liệu: {str(e)}"}), 500

