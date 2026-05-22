from app import db
from datetime import datetime

class ModelVersion(db.Model):
    __tablename__ = 'model_versions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    architecture = db.Column(db.String(50)) # ResNet50, VGG16, etc.
    version = db.Column(db.String(20))
    accuracy = db.Column(db.Float)
    f1_score = db.Column(db.Float)
    precision = db.Column(db.Float)
    recall = db.Column(db.Float)
    status = db.Column(db.String(20), default='Inactive') # Active, Testing, Inactive
    dataset = db.Column(db.String(100))
    # Lưu các thông số ma trận nhầm lẫn
    tn = db.Column(db.Integer)
    fp = db.Column(db.Integer)
    fn = db.Column(db.Integer)
    tp = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id_db": self.id,
            "name": self.name,
            "architecture": self.architecture,
            "version": self.version,
            "accuracy": f"{self.accuracy * 100:.1f}%",
            "f1Score": f"{self.f1_score:.2f}",
            "trainDate": self.created_at.strftime('%Y-%m-%d'),
            "status": self.status,
            "dataset": self.dataset
        }