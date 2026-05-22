import os
import keras  # Import trực tiếp từ keras
from keras.applications import DenseNet121
from keras.models import Model
from keras.layers import Dense, GlobalAveragePooling2D

# 1. Khởi tạo mạng DenseNet121 với kiến thức có sẵn (ImageNet)
base_model = DenseNet121(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# 2. Thêm "lớp cuối" để phân loại: Bình thường vs Viêm phổi
x = base_model.output
x = GlobalAveragePooling2D()(x)
predictions = Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# 3. Lưu thành file .h5 vào đúng thư mục
save_path = 'app/ai_models/densenet121_pneumonia.h5'
if not os.path.exists('app/ai_models'):
    os.makedirs('app/ai_models')

# Lưu model
model.save(save_path)
print(f"Đã tạo xong file não AI tại: {save_path}")