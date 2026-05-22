import os
from datetime import timedelta
from flask import Flask, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Khởi tạo các đối tượng extension ở ngoài để tránh Circular Import chuẩn xác
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # 1. CẤU HÌNH CORS (Duy nhất 1 lần, đầy đủ Header)
    CORS(app, resources={r"/api/*": {"origins": "*"}},
         allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
         expose_headers=["Authorization"],
         supports_credentials=True)

    # 2. CẤU HÌNH DATABASE (MySQL Port 3307)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost:3307/nckh2026'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # 3. CẤU HÌNH JWT (Vé thông hành)
    app.config['JWT_SECRET_KEY'] = 'hieu_cong_nghe_thong_tin_unre_2026_secret_key_pro'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

    # 4. KHỞI TẠO EXTENSIONS
    db.init_app(app)
    jwt.init_app(app)

    # 5. ĐĂNG KÝ BLUEPRINTS (Bắt buộc phải Import toàn bộ bên trong hàm này)
    with app.app_context():
        from app.api.auth import auth_bp
        from app.api.analysis import analysis_bp
        from app.api.feature import feature_bp
        from app.api.report import report_bp
        from app.api.statistics import statistics_bp
        from app.api.models import model_bp
        from app.api.chat import chat_bp

        # Đăng ký các cổng API định tuyến kết nối hệ thống
        app.register_blueprint(auth_bp,        url_prefix='/api/auth')
        app.register_blueprint(analysis_bp,    url_prefix='/api/analysis')
        app.register_blueprint(feature_bp,     url_prefix='/api/analysis') # Gộp prefix xử lý CORS cho file feature mới tách
        app.register_blueprint(report_bp,      url_prefix='/api/report')
        app.register_blueprint(statistics_bp,  url_prefix='/api/statistics')
        app.register_blueprint(model_bp,       url_prefix='/api/models')
        app.register_blueprint(chat_bp,        url_prefix='/api/chat')

    # 6. ROUTE PHỤC VỤ ẢNH X-QUANG
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        upload_path = os.path.join(os.path.dirname(app.root_path), 'uploads')
        return send_from_directory(upload_path, filename)

    # 7. XỬ LÝ LỖI JWT TỰ ĐỘNG
    @jwt.expired_token_loader
    def my_expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"msg": "Token đã hết hạn!", "error": "token_expired"}), 401

    @jwt.unauthorized_loader
    def my_unauthorized_callback(error):
        return jsonify({"msg": "Thiếu Header Authorization hoặc Token!", "error": "unauthorized"}), 401

    return app