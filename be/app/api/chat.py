import os
import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.analysis import Analysis
from app.models.user import User

chat_bp = Blueprint('chat', __name__)

def get_current_user_id():
    identity = get_jwt_identity()
    try:
        return int(identity)
    except (ValueError, TypeError):
        user = User.query.filter_by(email=identity).first()
        return user.id if user else None

@chat_bp.route('', methods=['POST'])
@jwt_required()
def chat_with_ai():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"msg": "Người dùng không tồn tại hoặc token hết hạn"}), 401

    data = request.get_json() or {}
    message = data.get('message', '').strip()
    history = data.get('history', [])  # danh sách các tin nhắn trước dạng {"role": "user"|"assistant", "content": "..."}

    if not message:
        return jsonify({"msg": "Tin nhắn không được để trống"}), 400

    # 1. Lấy toàn bộ hồ sơ bệnh án đã phân tích của bác sĩ này
    try:
        records = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.created_at.desc()).all()
    except Exception as e:
        records = []
        print(f"Lỗi truy vấn danh sách bệnh án: {e}")

    # 2. Định dạng danh sách bệnh án làm ngữ cảnh
    records_context = ""
    import urllib.parse
    if records:
        records_context = "Dưới đây là danh sách lịch sử bệnh án (kết quả phân tích X-quang phổi) đã thực hiện bởi bạn:\n"
        for idx, rec in enumerate(records, start=1):
            # Lấy tên file để tạo URL hợp lệ cho X-quang
            fname = rec.file_name or os.path.basename(rec.image_path.replace('\\', '/'))
            safe_fname = urllib.parse.quote(fname)
            image_url = f"http://localhost:5000/uploads/xrays/{safe_fname}"
            
            # Xử lý đường dẫn cho bản đồ nhiệt Grad-CAM
            if getattr(rec, 'heatmap_path', None):
                heatmap_fname = os.path.basename(rec.heatmap_path.replace('\\', '/'))
            else:
                heatmap_fname = f"heatmap_{fname}"
            safe_heatmap_fname = urllib.parse.quote(heatmap_fname)
            heatmap_url = f"http://localhost:5000/uploads/xrays/{safe_heatmap_fname}"
            
            records_context += (
                f"- Bệnh nhân: {rec.patient_name} (Mã bệnh nhân: {rec.patient_id}), "
                f"Kết quả phân tích: {rec.result}, "
                f"Độ tin cậy: {rec.confidence:.1f}%, "
                f"Ngày phân tích: {rec.created_at.strftime('%d/%m/%Y %H:%M')}, "
                f"Ảnh X-quang và Bản đồ nhiệt: ![X-quang {rec.patient_name}]({image_url}) ![Grad-CAM {rec.patient_name}]({heatmap_url})\n"
            )
    else:
        records_context = "Bác sĩ chưa thực hiện ca phân tích bệnh án nào trên hệ thống này.\n"

    # 3. Tạo prompt chỉ dẫn hệ thống
    system_instruction = (
        "Bạn là MediAI, một trợ lý y tế thông minh (AI Assistant) trên hệ thống X-quang phổi.\n"
        "QUAN TRỌNG VỀ ĐỊNH DANH VÀ XƯNG HÔ:\n"
        "- BẠN TÊN LÀ: MediAI. Khi xưng hô, BẠN PHẢI xưng là 'MediAI' hoặc 'Tôi'.\n"
        "- BẠN KHÔNG PHẢI LÀ BÁC SĨ. BẠN CHỈ LÀ TRỢ LÝ AI.\n"
        "- Người đang chat với bạn là một 'Bác sĩ'. Hãy luôn gọi họ là 'Bác sĩ'.\n"
        "\n"
        "Nhiệm vụ của bạn là tra cứu và trả lời thông tin bệnh án cũ dựa trên dữ liệu thật dưới đây:\n"
        "--------------------------------------------------\n"
        f"{records_context}"
        "--------------------------------------------------\n"
        "HƯỚNG DẪN TRẢ LỜI:\n"
        "1. Tra cứu bệnh nhân: Nếu bác sĩ hỏi về bệnh nhân (ví dụ: 'Nguyễn Văn A', 'PAT001'), hãy cung cấp đầy đủ thông tin: Họ tên, Kết quả, Độ tin cậy. QUAN TRỌNG: BẮT BUỘC chép y nguyên đoạn mã 'Ảnh X-quang và Bản đồ nhiệt: ![...](...) ![...](...)' của bệnh nhân đó vào câu trả lời để hiển thị cả 2 ảnh (ảnh X-quang gốc và ảnh Grad-CAM) cho bác sĩ xem!\n"
        "2. Không tìm thấy: Nếu không có trong danh sách trên, hãy phản hồi không tìm thấy hồ sơ.\n"
        "3. Câu hỏi thống kê: Nếu hỏi thống kê (ví dụ: 'Bao nhiêu ca viêm phổi?'), hãy đếm và liệt kê chính xác từ danh sách.\n"
        "4. Trả lời súc tích, lịch sự bằng tiếng Việt, có thể in đậm (**text**) để dễ đọc và tuyệt đối giữ đúng xưng hô."
    )

    # 4. Cấu hình Groq API và Model Llama 3.1
    # Bác sĩ cấu hình khóa Groq tại biến môi trường GROQ_API_KEY
    groq_api_key = os.environ.get("GROQ_API_KEY", "")
    model_name = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")

    # Nếu không có Groq API key, thử lấy key Gemini cũ làm dự phòng hoặc thông báo
    if not groq_api_key:
        # Nếu chưa cấu hình GROQ_API_KEY, thông báo rõ ràng cho bác sĩ cấu hình
        reply = "Xin lỗi bác sĩ, hệ thống chưa cấu hình khóa API Groq (`GROQ_API_KEY`). Vui lòng thiết lập biến môi trường này để trò chuyện với mô hình Llama 3.1."
        return jsonify({"reply": reply}), 200

    # Xây dựng hội thoại theo định dạng OpenAI/Groq
    messages = [{"role": "system", "content": system_instruction}]
    for msg in history:
        role = 'assistant' if msg.get('role') == 'assistant' else 'user'
        messages.append({
            "role": role,
            "content": msg.get('content', '')
        })
    
    # Thêm câu hỏi hiện tại
    messages.append({
        "role": "user",
        "content": message
    })

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
                "temperature": 0.2,
                "max_tokens": 1024
            },
            timeout=30
        )

        if response.status_code == 200:
            res_data = response.json()
            reply = res_data['choices'][0]['message']['content']
        else:
            print(f"Lỗi Groq API ({response.status_code}): {response.text}")
            reply = f"Lỗi từ Groq API ({response.status_code}). Bác sĩ vui lòng kiểm tra lại tính hợp lệ của khóa API."
    except Exception as e:
        print(f"Lỗi kết nối Groq API: {e}")
        reply = "Xin lỗi bác sĩ, không thể kết nối tới máy chủ Groq (Llama 3.1) tại thời điểm này. Vui lòng kiểm tra lại mạng hoặc thử lại sau."

    return jsonify({"reply": reply}), 200
