import google.generativeai as genai
import os

def generate_medical_report(patient_name, result, confidence):
    """
    Sử dụng Google Gemini để tạo nhận định chuyên môn dựa trên kết quả từ DenseNet121.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        return f"Ghi chú: Kết quả phát hiện {result}. (Chưa cấu hình GEMINI_API_KEY trong .env)"

    # Cấu hình Gemini
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Thiết lập ngữ cảnh (Prompt Engineering)
    prompt = f"""
    Bạn là một bác sĩ chuyên khoa chẩn đoán hình ảnh giàu kinh nghiệm. 
    Hệ thống AI vừa phân tích ảnh X-quang của bệnh nhân {patient_name}.
    Kết quả từ mô hình Deep Learning: {result}
    Độ tin cậy: {confidence}

    Hãy viết một đoạn phân tích ngắn (khoảng 3-4 câu) bằng tiếng Việt. 
    Yêu cầu:
    1. Giải thích ý nghĩa của kết quả này.
    2. Đưa ra lời khuyên y tế thực tế cho bệnh nhân.
    3. Giọng văn chuyên nghiệp, điềm tĩnh nhưng dễ hiểu.
    4. Ghi chú rõ đây là nhận định hỗ trợ từ AI.
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Lỗi gọi Gemini API: {e}")
        return f"Ghi chú: Kết quả phát hiện {result}. Đề nghị bác sĩ hội chẩn thêm."
