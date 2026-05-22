# seed_models.py
from app import create_app, db
from app.models.model_version import ModelVersion

app = create_app()

def seed_data():
    with app.app_context():
        # Xóa dữ liệu cũ nếu muốn làm mới hoàn toàn
        # db.session.query(ModelVersion).delete()

        m1 = ModelVersion(
            name="ResNet50 Pro", architecture="ResNet50", version="2.1",
            accuracy=0.965, f1_score=0.96, precision=0.96, recall=0.98,
            status="Active", dataset="ChestX-Ray-14",
            tn=450, fp=23, fn=15, tp=512  # Confusion Matrix
        )

        m2 = ModelVersion(
            name="VGG16 Standard", architecture="VGG16", version="4.0",
            accuracy=0.942, f1_score=0.93, precision=0.94, recall=0.92,
            status="Testing", dataset="ChestX-Ray-14 + Aug",
            tn=420, fp=53, fn=30, tp=497
        )

        db.session.add_all([m1, m2])
        db.session.commit()
        print(" Đã 'bơm' dữ liệu mô hình vào MySQL thành công!")

if __name__ == "__main__":
    seed_data()