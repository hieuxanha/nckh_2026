from dotenv import load_dotenv
import os

load_dotenv()

from app import create_app, db

app = create_app()

with app.app_context():
    db.create_all()
    print("--- Đã kiểm tra và tạo bảng Database thành công ---")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)