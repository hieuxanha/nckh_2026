from app import db
from datetime import datetime


class Analysis(db.Model):
    __tablename__ = 'analyses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patient_id = db.Column(db.String(50), nullable=False)
    patient_name = db.Column(db.String(100), nullable=False)
    file_name = db.Column(db.String(100))
    # Dùng db.Text để chứa được link ảnh Google siêu dài
    image_path = db.Column(db.Text, nullable=False)
    heatmap_path = db.Column(db.Text)  # Ảnh AI nhuộm màu (MỚI)
    # ĐÂY LÀ CỘT CÒN THIẾU CỦA BẠN:
    result = db.Column(db.String(50), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        # Tự động tính toán class CSS để Frontend không phải viết logic
        is_pneumonia = self.result == 'Viêm phổi'

        return {
            "id_db": self.id,
            "id": self.patient_id,
            "ten": self.patient_name,
            "fileName": self.file_name or self.patient_id,
            "image": self.image_path,
            "heatmap_path": self.heatmap_path,
            "thumbnail": self.image_path,  # Phục vụ trang History
            "date": self.created_at.strftime("%d/%m/%Y"),
            "time": self.created_at.strftime("%H:%M"),
            "result": self.result,
            "confidence": f"{self.confidence:.1f}%",
            # CSS phục vụ [ngClass] của Hiếu
            "statusClass": "bg-red-500/10 text-red-500 border-red-500/20" if is_pneumonia else "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            "dotClass": "bg-red-500" if is_pneumonia else "bg-emerald-500"
        }