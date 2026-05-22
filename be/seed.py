from app import create_app, db
from app.models.user import User
from flask_bcrypt import Bcrypt


def seed_admin():
    app = create_app()
    bcrypt = Bcrypt()

    with app.app_context():
        # 1. Thông tin Admin muốn tạo
        admin_email = "admin@gmail.com"
        admin_password = "123123"  # Bạn có thể đổi mật khẩu tại đây
        admin_fullname = "Hệ thống Quản trị viên"

        # 2. Kiểm tra xem Admin này đã tồn tại chưa để tránh trùng lặp
        existing_admin = User.query.filter_by(email=admin_email).first()

        if existing_admin:
            print(f"--- Thông báo: Tài khoản {admin_email} đã tồn tại trong hệ thống. ---")
            # Nếu muốn cập nhật role cho tài khoản cũ thành admin:
            existing_admin.role = 'admin'
            db.session.commit()
            print("--- Đã cập nhật quyền Admin cho tài khoản hiện có. ---")
        else:
            # 3. Mã hóa mật khẩu
            hashed_pw = bcrypt.generate_password_hash(admin_password).decode('utf-8')

            # 4. Tạo đối tượng Admin mới
            new_admin = User(
                fullname=admin_fullname,
                email=admin_email,
                password_hash=hashed_pw,
                role='admin'  # Gán quyền Admin ở đây
            )

            try:
                db.session.add(new_admin)
                db.session.commit()
                print("------------------------------------------")
                print("TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!")
                print(f"Email: {admin_email}")
                print(f"Password: {admin_password}")
                print("------------------------------------------")
            except Exception as e:
                db.session.rollback()
                print(f"--- Lỗi khi tạo Admin: {e} ---")


if __name__ == "__main__":
    seed_admin()