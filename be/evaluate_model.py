import os
import keras
import numpy as np
from keras import layers
from keras.applications import DenseNet121
from keras.models import Model
from keras.optimizers import Adam
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# 1. ĐƯỜNG DẪN DỮ LIỆU
DATA_PATH = r'D:\nckh_2026\chest_xray'
MODEL_SAVE_PATH = 'app/ai_models/densenet121_pneumonia.h5'

# 2. TẢI DỮ LIỆU
print("📂 Đang nạp dữ liệu từ thư mục...")

train_ds = keras.utils.image_dataset_from_directory(
    os.path.join(DATA_PATH, 'train'),
    image_size=(224, 224),
    batch_size=16,
    label_mode='binary'
)

val_ds = keras.utils.image_dataset_from_directory(
    os.path.join(DATA_PATH, 'val'),
    image_size=(224, 224),
    batch_size=16,
    label_mode='binary'
)

test_ds = keras.utils.image_dataset_from_directory(
    os.path.join(DATA_PATH, 'test'),
    image_size=(224, 224),
    batch_size=16,
    label_mode='binary',
    shuffle=False
)

# 3. CHUẨN HÓA VÀ TĂNG CƯỜNG DỮ LIỆU
data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

rescale_layer = layers.Rescaling(1. / 255)

train_ds = train_ds.map(lambda x, y: (data_augmentation(rescale_layer(x), training=True), y))
val_ds = val_ds.map(lambda x, y: (rescale_layer(x), y))
test_ds = test_ds.map(lambda x, y: (rescale_layer(x), y))

# 4. XÂY DỰNG MÔ HÌNH DENSENET121
print("🚀 Khởi tạo DenseNet121...")
base_model = DenseNet121(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)
base_model.trainable = False

x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(512, activation='relu')(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=outputs)

# 5. BIÊN DỊCH VÀ HUẤN LUYỆN
model.compile(
    optimizer=Adam(learning_rate=1e-4),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

print(" Bắt đầu Training (Luyện não)...")
# training
model.fit(train_ds, validation_data=val_ds, epochs=10)

# 6. ĐÁNH GIÁ TRÊN TẬP TEST
print("🧪 Bắt đầu đánh giá trên tập test...")

# Lấy nhãn thật
y_true = np.concatenate([y.numpy() for x, y in test_ds]).astype(int).ravel()

# Dự đoán xác suất
y_prob = model.predict(test_ds).ravel()

# Chuyển sang nhãn 0/1
y_pred = (y_prob >= 0.5).astype(int)

# Tính chỉ số
accuracy = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print("\n========== KẾT QUẢ ĐÁNH GIÁ ==========")
print(f"Test Accuracy : {accuracy:.4f} ({accuracy * 100:.2f}%)")
print(f"Test Precision: {precision:.4f} ({precision * 100:.2f}%)")
print(f"Test Recall   : {recall:.4f} ({recall * 100:.2f}%)")
print(f"Test F1-score : {f1:.4f} ({f1 * 100:.2f}%)")

print("\n========== CLASSIFICATION REPORT ==========")
print(classification_report(y_true, y_pred, target_names=test_ds.class_names))

print("\n========== CONFUSION MATRIX ==========")
print(confusion_matrix(y_true, y_pred))

# 7. LƯU THÀNH QUẢ
if not os.path.exists('app/ai_models'):
    os.makedirs('app/ai_models')

model.save(MODEL_SAVE_PATH)
print(f"✅ XONG! Bộ não AI đã nằm tại: {MODEL_SAVE_PATH}")


# Epoch 1/10
# 100/100 [====================] - loss: 0.45 - accuracy: 0.82

# | Thành phần      | Dùng để làm gì           |
# | --------------- | ------------------------ |
# | train/          | Train model              |
# | val/            | Kiểm tra trong lúc train |
# | test/           | Đánh giá cuối            |
# | ảnh user upload | Dự đoán thực tế          |