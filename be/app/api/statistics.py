from datetime import datetime, timedelta
from collections import defaultdict

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from app import db
from app.models.analysis import Analysis
from app.models.user import User

# ----------------------------------------------------------------
# Blueprint: /api/statistics
# ----------------------------------------------------------------
statistics_bp = Blueprint('statistics', __name__)


def _get_current_user_id():
    """Lấy user_id từ JWT (hỗ trợ int lẫn email làm identity)."""
    identity = get_jwt_identity()
    try:
        return int(identity)
    except (ValueError, TypeError):
        user = User.query.filter_by(email=identity).first()
        return user.id if user else None


# ----------------------------------------------------------------
# API 1: TỔNG QUAN  →  GET /api/statistics/overview
# Trả về: tổng ca, viêm phổi, bình thường, tỷ lệ %
# ----------------------------------------------------------------
@statistics_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_overview():
    user_id = _get_current_user_id()
    if not user_id:
        return jsonify({'msg': 'Token không hợp lệ'}), 401

    user = User.query.get(user_id)
    is_admin = user and user.role == 'admin'
    
    # Nếu là Admin thì xem tất cả, nếu là Doctor thì chỉ xem của mình
    if is_admin:
        total     = Analysis.query.count()
        pneumonia = Analysis.query.filter_by(result='Viêm phổi').count()
        normal    = Analysis.query.filter_by(result='Bình thường').count()
        avg_confidence = db.session.query(func.avg(Analysis.confidence)).scalar()
    else:
        total     = Analysis.query.filter_by(user_id=user_id).count()
        pneumonia = Analysis.query.filter_by(user_id=user_id, result='Viêm phổi').count()
        normal    = Analysis.query.filter_by(user_id=user_id, result='Bình thường').count()
        avg_confidence = db.session.query(func.avg(Analysis.confidence)).filter_by(user_id=user_id).scalar()

    pneumonia_rate = round(pneumonia / total * 100, 1) if total > 0 else 0.0
    normal_rate    = round(normal    / total * 100, 1) if total > 0 else 0.0

    return jsonify({
        'total':           total,
        'pneumonia':       pneumonia,
        'normal':          normal,
        'pneumonia_rate':  pneumonia_rate,
        'normal_rate':     normal_rate,
        'avg_confidence':  round(float(avg_confidence), 1) if avg_confidence else 0.0,
    }), 200


# ----------------------------------------------------------------
# API 2: BAR CHART  →  GET /api/statistics/chart?period=month|week|day
#
# - month: 6 tháng gần nhất, nhóm theo tháng
# - week:  6 tuần gần nhất,  nhóm theo tuần (ISO week)
# - day:   7 ngày gần nhất,  nhóm theo ngày
# ----------------------------------------------------------------
@statistics_bp.route('/chart', methods=['GET'])
@jwt_required()
def get_chart():
    user_id = _get_current_user_id()
    if not user_id:
        return jsonify({'msg': 'Token không hợp lệ'}), 401

    user = User.query.get(user_id)
    is_admin = user and user.role == 'admin'

    period = request.args.get('period', 'month')   # 'month' | 'week' | 'day'
    now    = datetime.now()

    # ── Xác định khoảng thời gian và hàm nhóm ──────────────────────
    if period == 'day':
        since   = now - timedelta(days=6)           # 7 ngày kể cả hôm nay
        query = Analysis.query.filter(Analysis.created_at >= since.replace(hour=0, minute=0, second=0))
        if not is_admin:
            query = query.filter_by(user_id=user_id)
        records = query.all()

        # Tạo bucket cho 7 ngày
        buckets: dict[str, dict] = {}
        for i in range(6, -1, -1):
            d = now - timedelta(days=i)
            key = d.strftime('%Y-%m-%d')
            dow = ['T2','T3','T4','T5','T6','T7','CN'][d.weekday()]
            buckets[key] = {'label': dow, 'normal': 0, 'pneumonia': 0}

        for rec in records:
            key = rec.created_at.strftime('%Y-%m-%d')
            if key in buckets:
                if rec.result == 'Bình thường':
                    buckets[key]['normal'] += 1
                else:
                    buckets[key]['pneumonia'] += 1

        bar_data = list(buckets.values())

    elif period == 'week':
        since = now - timedelta(weeks=5)            # 6 tuần gần nhất

        query = Analysis.query.filter(Analysis.created_at >= since)
        if not is_admin:
            query = query.filter_by(user_id=user_id)
        records = query.all()

        # Bucket theo ISO week
        buckets: dict[str, dict] = {}
        for i in range(5, -1, -1):
            week_start = now - timedelta(weeks=i)
            iso_year, iso_week, _ = week_start.isocalendar()
            key   = f'{iso_year}-W{iso_week:02d}'
            label = f'Tuần {6 - i}'
            buckets[key] = {'label': label, 'normal': 0, 'pneumonia': 0}

        for rec in records:
            iso_year, iso_week, _ = rec.created_at.isocalendar()
            key = f'{iso_year}-W{iso_week:02d}'
            if key in buckets:
                if rec.result == 'Bình thường':
                    buckets[key]['normal'] += 1
                else:
                    buckets[key]['pneumonia'] += 1

        bar_data = list(buckets.values())

    else:  # month (default)
        query = Analysis.query.filter(Analysis.created_at >= now - timedelta(days=180))
        if not is_admin:
            query = query.filter_by(user_id=user_id)
        records = query.all()

        # Bucket theo tháng
        MONTHS_VI = ['', 'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
                          'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']
        buckets: dict[str, dict] = {}
        for i in range(5, -1, -1):
            # Tính tháng cách đây i tháng
            month = (now.month - i - 1) % 12 + 1
            year  = now.year + ((now.month - i - 1) // 12)
            key   = f'{year}-{month:02d}'
            buckets[key] = {'label': MONTHS_VI[month], 'normal': 0, 'pneumonia': 0}

        for rec in records:
            key = rec.created_at.strftime('%Y-%m')
            if key in buckets:
                if rec.result == 'Bình thường':
                    buckets[key]['normal'] += 1
                else:
                    buckets[key]['pneumonia'] += 1

        bar_data = list(buckets.values())

    return jsonify({'period': period, 'data': bar_data}), 200
