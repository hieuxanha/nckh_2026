from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# Khai báo Blueprint
auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()


def is_admin():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.role.lower() == 'admin'

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'doctor')

        if not fullname or not email or not password:
            return jsonify({"message": "Thiếu thông tin đăng ký"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email đã tồn tại"}), 409

        # Mã hóa mật khẩu
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(fullname=fullname, email=email, password_hash=hashed_pw, role=role)

        db.session.add(new_user)
        db.session.commit()

        # Tạo Token JWT (Dùng ID làm định danh)
        access_token = create_access_token(identity=str(new_user.id))

        return jsonify({
            "message": "Đăng ký thành công",
            "access_token": access_token,
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Lỗi hệ thống", "error": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"--- DEBUG LOGIN ---")
        print(f"Dữ liệu nhận được: {data}")  # Xem Angular có gửi đúng 'email' và 'password' không

        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if not user:
            print(f"Lỗi: Không tìm thấy User với email {email}")
            return jsonify({"message": "Email không tồn tại"}), 401

        # Kiểm tra mật khẩu
        is_valid = bcrypt.check_password_hash(user.password_hash, password)
        print(f"Kết quả kiểm tra mật khẩu: {is_valid}")

        if is_valid:
            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                "message": "Đăng nhập thành công",
                "access_token": access_token,
                "user": user.to_dict()
            }), 200

        return jsonify({"message": "Mật khẩu không chính xác"}), 401
    except Exception as e:
        print(f"Lỗi hệ thống: {str(e)}")
        return jsonify({"message": "Lỗi xử lý đăng nhập", "error": str(e)}), 500

# Tại các API quản trị trong auth.py
@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users_list():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    # ✅ Sửa ở đây: .lower() để 'Admin' hay 'admin' đều được chấp nhận
    if not user or user.role.lower() != 'admin':
        return jsonify({"message": "Bạn không có quyền truy cập!"}), 403

    all_users = User.query.all()
    return jsonify([u.to_dict() for u in all_users]), 200


# 4. Cập nhật trạng thái người dùng (Khóa/Mở khóa/Duyệt)
@auth_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@jwt_required()
def update_status(user_id):
    data = request.get_json()
    new_status = data.get('status')  # 'active' hoặc 'locked'

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Không tìm thấy người dùng"}), 404

    user.status = new_status
    db.session.commit()
    return jsonify({"message": "Cập nhật trạng thái thành công"}), 200


# 5. Xóa người dùng
@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Không tìm thấy người dùng"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Đã xóa người dùng vĩnh viễn"}), 200