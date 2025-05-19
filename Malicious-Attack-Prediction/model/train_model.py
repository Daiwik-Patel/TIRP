import torch
import torch.nn as nn
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os

# Set random seed
RANDOM_SEED = 42
torch.manual_seed(RANDOM_SEED)

# Autoencoder Model
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

# Dataset column names for NSL-KDD
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

# Main Training Function
def train(data_path):
    print(f"\n Loading dataset from: {data_path}")
    df = pd.read_csv(data_path, names=COLUMNS)
    df.drop(columns=['level'], inplace=True)

    print("\n Preprocessing dataset...")

    # Drop categorical columns
    categorical_columns = ['protocol_type', 'service', 'flag']
    df.drop(columns=categorical_columns, inplace=True)

    # Separate features and labels
    X = df.drop(columns=['attack'])
    y = df['attack']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y
    )

    # Convert features to PyTorch tensors
    X_train_tensor = torch.tensor(X_train, dtype=torch.float32)
    X_test_tensor = torch.tensor(X_test, dtype=torch.float32)

    # Define Autoencoder
    input_dim = X_train.shape[1]
    model = Autoencoder(input_dim)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    print("\n Training Autoencoder...")
    EPOCHS = 20
    for epoch in range(EPOCHS):
        model.train()
        reconstructed = model(X_train_tensor)
        loss = criterion(reconstructed, X_train_tensor)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if (epoch + 1) % 5 == 0:
            print(f"Epoch {epoch + 1}/{EPOCHS} | Loss: {loss.item():.4f}")

    # Get encoded features
    model.eval()
    with torch.no_grad():
        encoded_train = model.encoder(X_train_tensor).numpy()
        encoded_test = model.encoder(X_test_tensor).numpy()

    print("\n Training Random Forest Classifier on Encoded Features...")
    rf = RandomForestClassifier(n_estimators=50, random_state=RANDOM_SEED)
    rf.fit(encoded_train, y_train)

    # Prediction and evaluation
    y_pred = rf.predict(encoded_test)

    print(f"\n Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\n Classification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))
    print("\n Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save all components
    save_dir = "./model_output"
    os.makedirs(save_dir, exist_ok=True)
    torch.save(model.state_dict(), os.path.join(save_dir, "autoencoder.pth"))
    joblib.dump(rf, os.path.join(save_dir, "random_forest.pkl"))
    joblib.dump(scaler, os.path.join(save_dir, "scaler.pkl"))
    joblib.dump(X.columns.tolist(), os.path.join(save_dir, "feature_columns.pkl"))
    joblib.dump(input_dim, os.path.join(save_dir, "input_dim.pkl"))

    print(f"\n All models and metadata saved successfully.")

# Entry point
if __name__ == "__main__":
    data_path = r"D:\STUDIES\AUSTRALIA\Swinburne\STUDY\Sem-3\TIRP\Malicious-Attack-Prediction\model\Data\KDDTrain+.txt"
    train(data_path)
