import os
import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import joblib
from rest_framework.decorators import api_view
from rest_framework.response import Response
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from .models import Autoencoder 

# Attack mapping used for label simplification
attack_mapping = {
    'normal': 'normal',
    'back': 'ddos attack', 'land': 'ddos attack', 'neptune': 'ddos attack', 'pod': 'ddos attack',
    'smurf': 'ddos attack', 'teardrop': 'ddos attack',
    'ipsweep': 'port scan', 'nmap': 'port scan', 'portsweep': 'port scan', 'satan': 'port scan',
    'ftp_write': 'ransomware', 'guess_passwd': 'ransomware', 'warezclient': 'ransomware', 'warezmaster': 'ransomware',
    'imap': 'virus', 'phf': 'virus', 'buffer_overflow': 'virus', 'loadmodule': 'virus',
    'multihop': 'virus', 'rootkit': 'virus'
}

# Autoencoder model definition
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

@api_view(['POST'])
def predict_attack(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=400)

    file = request.FILES['file']
    df = pd.read_csv(file, names=[
        'duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes',
        'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins',
        'logged_in', 'num_compromised', 'root_shell', 'su_attempted', 'num_root',
        'num_file_creations', 'num_shells', 'num_access_files', 'num_outbound_cmds',
        'is_host_login', 'is_guest_login', 'count', 'srv_count', 'serror_rate',
        'srv_serror_rate', 'rerror_rate', 'srv_rerror_rate', 'same_srv_rate',
        'diff_srv_rate', 'srv_diff_host_rate', 'dst_host_count',
        'dst_host_srv_count', 'dst_host_same_srv_rate', 'dst_host_diff_srv_rate',
        'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate',
        'dst_host_serror_rate', 'dst_host_srv_serror_rate', 'dst_host_rerror_rate',
        'dst_host_srv_rerror_rate', 'attack', 'level'
    ])

    df.drop(columns=['level', 'protocol_type', 'service', 'flag'], inplace=True)
    df['attack'] = df['attack'].str.strip().str.lower().map(attack_mapping)

    df = df[df['attack'].notnull()]  # remove rows with unmapped labels

    X = df.drop(columns=['attack'])
    y_true = df['attack'].tolist()

    # Load preprocessing and models
    model_dir = r'D:\STUDIES\AUSTRALIA\Swinburne\STUDY\Sem-3\TIRP\Malicious-Attack-Prediction\model\model_output'
    input_dim = joblib.load(os.path.join(model_dir, 'input_dim.pkl'))
    scaler = joblib.load(os.path.join(model_dir, 'scaler.pkl'))
    rf = joblib.load(os.path.join(model_dir, 'random_forest.pkl'))

    X_scaled = scaler.transform(X)
    X_tensor = torch.tensor(X_scaled, dtype=torch.float32)

    autoencoder = Autoencoder(input_dim)
    autoencoder.load_state_dict(torch.load(os.path.join(model_dir, 'autoencoder.pth')))
    autoencoder.eval()

    with torch.no_grad():
        encoded = autoencoder.encoder(X_tensor).numpy()

    y_pred = rf.predict(encoded)
    y_pred = y_pred.tolist()

    acc = accuracy_score(y_true, y_pred)
    report = classification_report(y_true, y_pred, zero_division=0, output_dict=True)
    conf_matrix = confusion_matrix(y_true, y_pred).tolist()

    return Response({
        'accuracy': acc,
        'classification_report': report,
        'confusion_matrix': conf_matrix,
        'true_labels': y_true[:10],
        'predicted_labels': y_pred[:10]
    })
# The above code defines a Django view that handles file uploads for attack prediction.