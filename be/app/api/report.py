import csv
import io
from datetime import datetime

from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.analysis import Analysis
from app.models.user import User

# ----------------------------------------------------------------
# Blueprint: /api/report
# ----------------------------------------------------------------
report_bp = Blueprint('report', __name__)


def _get_current_user_id():
    """Lấy user_id từ JWT token (hỗ trợ cả int lẫn email làm identity)."""
    identity = get_jwt_identity()
    try:
        return int(identity)
    except (ValueError, TypeError):
        user = User.query.filter_by(email=identity).first()
        return user.id if user else None


def _build_query(user_id: int, from_date_str: str, to_date_str: str, result_type: str):
    """Xây dựng SQLAlchemy query chung cho cả count lẫn export."""
    query = Analysis.query.filter_by(user_id=user_id)

    if from_date_str:
        from_date = datetime.strptime(from_date_str, '%Y-%m-%d')
        query = query.filter(Analysis.created_at >= from_date)

    if to_date_str:
        to_date = datetime.strptime(to_date_str, '%Y-%m-%d')
        to_date = to_date.replace(hour=23, minute=59, second=59)
        query = query.filter(Analysis.created_at <= to_date)

    if result_type == 'pneumonia':
        query = query.filter(Analysis.result == 'Viêm phổi')
    elif result_type == 'normal':
        query = query.filter(Analysis.result == 'Bình thường')

    return query


# ----------------------------------------------------------------
# API 1: ĐẾM SỐ BẢN GHI  →  GET /api/report/count
# ----------------------------------------------------------------
@report_bp.route('/count', methods=['GET'])
@jwt_required()
def count_export_records():
    """Trả về số bản ghi phù hợp với bộ lọc (dùng để hiển thị "Dự kiến X bản ghi")."""
    user_id = _get_current_user_id()
    if not user_id:
        return jsonify({'msg': 'Token không hợp lệ'}), 401

    from_date_str = request.args.get('from_date', '')
    to_date_str   = request.args.get('to_date', '')
    result_type   = request.args.get('result_type', '')

    try:
        count = _build_query(user_id, from_date_str, to_date_str, result_type).count()
    except ValueError:
        return jsonify({'msg': 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'}), 400

    return jsonify({'count': count}), 200


# ----------------------------------------------------------------
# API 2: XUẤT BÁO CÁO CSV  →  GET /api/report/export/csv
# ----------------------------------------------------------------
@report_bp.route('/export/csv', methods=['GET'])
@jwt_required()
def export_csv():
    """Xuất dữ liệu chẩn đoán thật từ DB thành file CSV (UTF-8 BOM – Excel mở đúng tiếng Việt)."""
    user_id = _get_current_user_id()
    if not user_id:
        return jsonify({'msg': 'Token không hợp lệ'}), 401

    from_date_str = request.args.get('from_date', '')
    to_date_str   = request.args.get('to_date', '')
    result_type   = request.args.get('result_type', '')

    try:
        records = (
            _build_query(user_id, from_date_str, to_date_str, result_type)
            .order_by(Analysis.created_at.desc())
            .all()
        )
    except ValueError:
        return jsonify({'msg': 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'}), 400

    # Tạo CSV trong bộ nhớ
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        'STT', 'Mã bệnh nhân', 'Tên bệnh nhân',
        'Kết quả chẩn đoán', 'Độ tin cậy (%)',
        'Ngày chẩn đoán', 'Giờ chẩn đoán', 'Tên file ảnh',
    ])

    # Dữ liệu
    for idx, rec in enumerate(records, start=1):
        writer.writerow([
            idx,
            rec.patient_id,
            rec.patient_name,
            rec.result,
            f'{rec.confidence:.1f}',
            rec.created_at.strftime('%d/%m/%Y'),
            rec.created_at.strftime('%H:%M'),
            rec.file_name or '',
        ])

    # Encode UTF-8 BOM để Excel nhận đúng tiếng Việt
    csv_bytes = output.getvalue().encode('utf-8-sig')
    output.close()

    timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'BaoCao_ChanDoan_{timestamp_str}.csv'

    response = make_response(csv_bytes)
    response.headers['Content-Type'] = 'text/csv; charset=utf-8-sig'
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition'
    return response
