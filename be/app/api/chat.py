import os
import requests
import urllib.parse
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.analysis import Analysis
from app.models.user import User

chat_bp = Blueprint('chat', __name__)

def get_current_user():
    """Lấy đối tượng User hiện tại từ JWT."""
    identity = get_jwt_identity()
    try:
        user_id = int(identity)
        return User.query.get(user_id)
    except (ValueError, TypeError):
        return User.query.filter_by(email=identity).first()

@chat_bp.route('', methods=['POST'])
@jwt_required()
def chat_with_ai():
    user = get_current_user()
    if not user:
        return jsonify({"msg": "Người dùng không tồn tại hoặc token hết hạn"}), 401

    data = request.get_json() or {}
    message = data.get('message', '').strip()
    history = data.get('history', [])  # danh sách tin nhắn cũ

    if not message:
        return jsonify({"msg": "Tin nhắn không được để trống"}), 400

    # 1. Lấy dữ liệu bệnh án làm ngữ cảnh
    # Nếu là Admin -> Thấy toàn bộ. Nếu là Doctor -> Thấy của mình.
    try:
        if user.role.lower() == 'admin':
            records = Analysis.query.order_by(Analysis.created_at.desc()).limit(50).all()
        else:
            records = Analysis.query.filter_by(user_id=user.id).order_by(Analysis.created_at.desc()).all()
    except Exception as e:
        print(f"Lỗi truy vấn danh sách bệnh án: {e}")
        records = []

    # 2. Định dạng danh sách bệnh án (Sử dụng host_url động)
    base_url = request.host_url.rstrip('/')
    records_context = ""
    if records:
        records_context = "Dưới đây là danh sách lịch sử bệnh án (kết quả phân tích X-quang phổi) đã thực hiện trên hệ thống:\n"
        for rec in records:
            fname = rec.file_name or os.path.basename(rec.image_path.replace('\\', '/'))
            safe_fname = urllib.parse.quote(fname)
            image_url = f"{base_url}/uploads/xrays/{safe_fname}"
            
            # Heatmap
            heatmap_fname = f"heatmap_{fname}"
            if getattr(rec, 'heatmap_path', None):
                heatmap_fname = os.path.basename(rec.heatmap_path.replace('\\', '/'))
            safe_heatmap_fname = urllib.parse.quote(heatmap_fname)
            heatmap_url = f"{base_url}/uploads/xrays/{safe_heatmap_fname}"
            
            records_context += (
                f"- Bệnh nhân: {rec.patient_name} (ID: {rec.patient_id}), "
                f"Kết quả: {rec.result}, "
                f"Độ tin cậy: {rec.confidence:.1f}%, "
                f"Ngày: {rec.created_at.strftime('%d/%m/%Y')}, "
                f"Ảnh: ![X-quang]({image_url}) ![Heatmap]({heatmap_url})\n"
            )
    else:
        records_context = "Chưa có dữ liệu phân tích bệnh án nào được ghi nhận.\n"

    # 3. Tạo prompt chỉ dẫn hệ thống
    system_instruction = (
        "Bạn là MediAI, trợ lý y tế thông minh. Bạn đang hỗ trợ một chuyên gia y tế.\n"
        "QUY TẮC XƯNG HÔ:\n"
        "- Bạn tự xưng là 'MediAI' hoặc 'Tôi'.\n"
        "- Luôn gọi người dùng là 'Bác sĩ'.\n"
        "\n"
        "DỮ LIỆU NGỮ CẢNH:\n"
        "--------------------------------------------------\n"
        f"{records_context}"
        "--------------------------------------------------\n"
        "NHIỆM VỤ:\n"
        "1. Tra cứu: Khi bác sĩ hỏi về bệnh nhân, hãy tìm trong danh sách trên và cung cấp thông tin. "
        "BẮT BUỘC chép nguyên đoạn mã Markdown ảnh ![...](...) để bác sĩ xem được hình ảnh.\n"
        "2. Thống kê: Trả lời các câu hỏi về số lượng ca bệnh dựa trên dữ liệu thật.\n"
        "3. Chuyên môn: Nếu hỏi về kiến thức y khoa, hãy trả lời dựa trên kiến thức chuẩn nhưng luôn nhắc nhở bác sĩ hội chẩn kỹ thuật.\n"
        "4. Thái độ: Lịch sự, chuyên nghiệp, súc tích."
    )

    # 4. Cấu hình Groq
    groq_api_key = os.environ.get("GROQ_API_KEY")
    model_name = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")

    if not groq_api_key:
        return jsonify({"reply": "Lỗi: Hệ thống chưa cấu hình GROQ_API_KEY trong file .env."}), 200

    # Xây dựng hội thoại
    messages = [{"role": "system", "content": system_instruction}]
    for msg in history:
        messages.append({
            "role": 'assistant' if msg.get('role') == 'assistant' else 'user',
            "content": msg.get('content', '')
        })
    messages.append({"role": "user", "content": message})

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model_name,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 1024
            },
            timeout=30
        )

        if response.status_code == 200:
            res_data = response.json()
            reply = res_data['choices'][0]['message']['content']
            return jsonify({"reply": reply}), 200
        elif response.status_code == 401:
            return jsonify({"reply": "Lỗi: Khóa API Groq không hợp lệ hoặc đã hết hạn. Vui lòng cập nhật file .env."}), 200
        else:
            return jsonify({"reply": f"Lỗi hệ thống Groq (Mã lỗi: {response.status_code})."}), 200

    except Exception as e:
        print(f"Lỗi kết nối Groq: {e}")
        return jsonify({"reply": "Xin lỗi bác sĩ, hiện tại tôi không thể kết nối tới máy chủ AI. Vui lòng thử lại sau."}), 200
