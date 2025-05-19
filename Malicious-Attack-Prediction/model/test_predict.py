import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Random seed
RANDOM_SEED = 42
torch.manual_seed(RANDOM_SEED)

# Autoencoder definition (same as training)
class Autoencoder(nn.Module):
    def __init__(self, input_dim):
        super(Autoencoder, self).__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 32)
        )
        self.decoder = nn.Sequential(
            nn.Linear(32, 64),
            nn.ReLU(),
            nn.Linear(64, 128),
            nn.ReLU(),
            nn.Linear(128, input_dim)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

# Column names for NSL-KDD
COLUMNS = ['duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes',
           'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins',
           'logged_in', 'num_compromised', 'root_shell', 'su_attempted',
           'num_root', 'num_file_creations', 'num_shells', 'num_access_files',
           'num_outbound_cmds', 'is_host_login', 'is_guest_login', 'count',
           'srv_count', 'serror_rate', 'srv_serror_rate', 'rerror_rate',
           'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate', 'srv_diff_host_rate',
           'dst_host_count', 'dst_host_srv_count', 'dst_host_same_srv_rate',
           'dst_host_diff_srv_rate', 'dst_host_same_src_port_rate',
           'dst_host_srv_diff_host_rate', 'dst_host_serror_rate',
           'dst_host_srv_serror_rate', 'dst_host_rerror_rate',
           'dst_host_srv_rerror_rate', 'attack', 'level']

def test(test_data_path):
    print(f"\n Loading test dataset from: {test_data_path}")
    df = pd.read_csv(test_data_path, names=COLUMNS)
    df.drop(columns=['level'], inplace=True)

    # Drop categorical columns
    categorical_columns = ['protocol_type', 'service', 'flag']
    df.drop(columns=categorical_columns, inplace=True)

    # Separate features and labels
    X = df.drop(columns=['attack'])
    y = df['attack']

    # Load models and preprocessing tools
    print("\n Loading saved models and scaler...")
    model_dir = "./model_output"
    input_dim = joblib.load(os.path.join(model_dir, "input_dim.pkl"))
    scaler = joblib.load(os.path.join(model_dir, "scaler.pkl"))
    rf = joblib.load(os.path.join(model_dir, "random_forest.pkl"))

    # Scale test features
    X_scaled = scaler.transform(X)
    X_tensor = torch.tensor(X_scaled, dtype=torch.float32)

    # Load Autoencoder model
    model = Autoencoder(input_dim)
    model.load_state_dict(torch.load(os.path.join(model_dir, "autoencoder.pth")))
    model.eval()

    # Encode test data
    with torch.no_grad():
        encoded = model.encoder(X_tensor).numpy()

    # Predict with RF
    print("\n Predicting with Random Forest...")
    y_pred = rf.predict(encoded)

    print(f"\n Accuracy: {accuracy_score(y, y_pred):.4f}")
    print("\n Classification Report:")
    print(classification_report(y, y_pred, zero_division=0))
    print("\n Confusion Matrix:")
    print(confusion_matrix(y, y_pred))

if __name__ == "__main__":
    test_data_path = r"D:\STUDIES\AUSTRALIA\Swinburne\STUDY\Sem-3\TIRP\Malicious-Attack-Prediction\model\Data\KDDTest+.txt"
    test(test_data_path)
