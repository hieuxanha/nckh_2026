import tensorflow as tf
import cv2
import numpy as np

print("--- KIỂM TRA HỆ THỐNG AI ---")
print(f"Phiên bản TensorFlow: {tf.__version__}")
print(f"Phiên bản OpenCV: {cv2.__version__}")
print(f"Phiên bản Numpy: {np.__version__}")

# Kiểm tra xem có nhận diện được thiết bị phần cứng không
devices = tf.config.list_physical_devices()
print(f"Thiết bị khả dụng: {devices}")

if any(dev.device_type == 'GPU' for dev in devices):
    print("🚀 TUYỆT VỜI: Đã tìm thấy GPU! AI sẽ chạy rất nhanh.")
else:
    print("💻 Đang dùng CPU: Chạy ổn cho việc chẩn đoán đơn lẻ.")