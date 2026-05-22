import pandas as pd
import json
import os


def save_training_logs(history, model_name):
    if not os.path.exists('logs'): os.makedirs('logs')

    # Lưu CSV để Hiếu dán vào Excel làm báo cáo NCKH
    pd.DataFrame(history.history).to_csv(f'logs/{model_name}.csv', index=False)

    # Lưu JSON để backup
    with open(f'logs/{model_name}.json', 'w') as f:
        json.dump(history.history, f)

    print(f"✅ Đã lưu log cho {model_name}")