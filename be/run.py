from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from app import create_app, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        # Tự động tạo bảng 'users' trong MySQL
        db.create_all()
        print("--- Đã kiểm tra và tạo bảng Database thành công ---")

    app.run(host='0.0.0.0', port=5000, debug=True)