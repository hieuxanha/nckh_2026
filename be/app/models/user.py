
from app import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20),nullable=False,default='doctor')
    status = db.Column(db.String(20), nullable=False, default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        # Tạo initials (Ví dụ: Nguyễn Văn An -> NA)
        names = self.fullname.split()
        initials = ""
        if len(names) >= 2:
            initials = names[0][0] + names[-1][0]
        elif len(names) == 1:
            initials = names[0][0]

        return {
            "id": f"USR-{self.created_at.year}-{self.id:03d}",  # Format: USR-2026-001
            "db_id": self.id,
            "name": self.fullname,
            "email": self.email,
            "role": self.role.capitalize(),  # Chữ cái đầu viết hoa cho đẹp
            "status": "Hoạt động" if self.status == 'active' else (
                "Đã khóa" if self.status == 'locked' else "Chờ duyệt"),
            "joinDate": self.created_at.strftime('%d/%m/%Y'),
            "initials": initials.upper(),
            # Các class màu sắc để Angular render trực tiếp
            "roleClass": "bg-blue-500/10 text-blue-400" if self.role == 'admin' else "bg-purple-500/10 text-purple-400",
            "statusClass": "bg-emerald-500/10 text-emerald-400" if self.status == 'active' else "bg-red-500/10 text-red-400",
            "dotClass": "bg-emerald-400" if self.status == 'active' else "bg-red-400"
        }