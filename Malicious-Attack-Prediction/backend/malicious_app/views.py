import os
import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import joblib
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from .models import Autoencoder, MLModel
from django.utils import timezone
import json
from collections import defaultdict
from datetime import datetime, timedelta
from django.http import JsonResponse
from rest_framework.views import APIView
from .serializers import MLModelSerializer, UserDisplaySerializer
from django.contrib.auth import get_user_model


# Ensure the model output directory exists in settings
MODEL_DIR = r"D:\STUDIES\AUSTRALIA\Swinburne\STUDY\Sem-3\TIRP\Malicious-Attack-Prediction\model\model_output"
SAVE_DIR_JSON = "./api_data_json"
DASHBOARD_DATA_DIR = "./dashboard_data_json"

# Random seed (should match training)
RANDOM_SEED = 42
torch.manual_seed(RANDOM_SEED)

# Autoencoder definition (must match training)
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

# Column names for NSL-KDD (must match training data)
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

# Load models and preprocessing tools (run only once at server startup)
try:
    INPUT_DIM = joblib.load(os.path.join(MODEL_DIR, "input_dim.pkl"))
    SCALER = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
    RF_MODEL = joblib.load(os.path.join(MODEL_DIR, "random_forest.pkl"))
    AUTOENCODER_MODEL = Autoencoder(INPUT_DIM)
    AUTOENCODER_MODEL.load_state_dict(torch.load(os.path.join(MODEL_DIR, "autoencoder.pth")))
    AUTOENCODER_MODEL.eval()
    MODELS_LOADED = True
    print("Models loaded successfully.")
except Exception as e:
    INPUT_DIM = None
    SCALER = None
    RF_MODEL = None
    AUTOENCODER_MODEL = None
    MODELS_LOADED = False
    print(f"Error loading models: {e}")

@api_view(['POST'])
def predict_attack(request):
    if not MODELS_LOADED:
        return Response({"error": "Models are not loaded. Please check the server logs."},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE)

    if 'file' not in request.FILES:
        return Response({"error": "Please upload a file."}, status=status.HTTP_400_BAD_REQUEST)

    uploaded_file = request.FILES['file']
    accuracy = None
    predicted_labels = None
    report = None
    matrix = None
    y_true = None

    try:
        df = pd.read_csv(uploaded_file, names=COLUMNS)
        df.drop(columns=['level'], inplace=True)

        # Separate features and labels
        y_true = df['attack'].tolist()
        X = df.drop(columns=['attack'])

        # Drop categorical columns
        categorical_columns = ['protocol_type', 'service', 'flag']
        X.drop(columns=categorical_columns, inplace=True, errors='ignore')

        # Ensure all numerical columns from training are present
        numerical_features = [col for col in COLUMNS[:-2] if col not in categorical_columns]
        for col in numerical_features:
            if col not in X.columns:
                X[col] = 0
        X = X[numerical_features]

        # Scale the features
        X_scaled = SCALER.transform(X)
        X_tensor = torch.tensor(X_scaled, dtype=torch.float32)

        # Encode the data
        with torch.no_grad():
            encoded = AUTOENCODER_MODEL.encoder(X_tensor).numpy()

        # Predict with RF
        predicted_labels = RF_MODEL.predict(encoded).tolist()

        # Calculate accuracy
        accuracy = accuracy_score(y_true, predicted_labels)

        # Generate classification report and confusion matrix
        report = classification_report(y_true, predicted_labels, zero_division=0, output_dict=True)
        matrix = confusion_matrix(y_true, predicted_labels).tolist()

        save_dir_json = "./api_data_json"
        os.makedirs(save_dir_json, exist_ok=True)
        timestamp_str = timezone.now().strftime('%Y%m%d_%H%M%S').replace(':', '%')
        filename = f"api_input_data_{timestamp_str}.json"
        file_path = os.path.join(save_dir_json, filename)

        # Save individual predictions with their true and predicted labels
        data_to_save = [{'attack': true, 'predicted': pred} for true, pred in zip(y_true, predicted_labels)]
        with open(file_path, 'w') as f:
            json.dump(data_to_save, f)

        # Prepare data for the dashboard chart JSON
        anomaly_counts = defaultdict(int)
        for pred in predicted_labels:
            if pred != 'normal':
                anomaly_counts[pred] += 1

        dashboard_data = {
            'prediction_timestamp': timezone.now().isoformat(),
            'accuracy': accuracy,
            'total_predictions': len(predicted_labels),
            'threats_detected': sum(1 for p in predicted_labels if p != 'normal'),
            'safe_entries': sum(1 for p in predicted_labels if p == 'normal'),
            'anomaly_distribution': {
                'labels': list(anomaly_counts.keys()),
                'datasets': [{'data': list(anomaly_counts.values()), 'backgroundColor': ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981']}], # Add more colors
            },
            'detection_rate_over_time': { # Basic - you might want to refine this
                'labels': [timezone.now().strftime('%Y-%m-%d %H:%M:%S')],
                'datasets': [{'label': 'Detections', 'data': [sum(1 for p in predicted_labels if p != 'normal')], 'borderColor': '#4F46E5', 'backgroundColor': 'rgba(79,70,229,0.2)', 'tension': 0.4, 'fill': True}]
            }
        }

        os.makedirs(DASHBOARD_DATA_DIR, exist_ok=True)
        dashboard_timestamp_str = timezone.now().strftime('%Y%m%d_%H%M%S').replace(':', '%')
        dashboard_filename = f"dashboard_data_{dashboard_timestamp_str}.json"
        dashboard_file_path = os.path.join(DASHBOARD_DATA_DIR, dashboard_filename)

        try:
            with open(dashboard_file_path, 'w') as f:
                json.dump(dashboard_data, f, indent=4) # Save with indentation
            print(f"Dashboard data saved to: {dashboard_file_path}")
        except Exception as e:
            print(f"Error saving dashboard data: {e}")

        return Response({
            "accuracy": accuracy,
            "classification_report": report,
            "confusion_matrix": matrix,
            "true_labels": y_true,
            "predicted_labels": predicted_labels
        })

    except Exception as e:
        print(f"Prediction Error Details: {e}")
        return Response({"error": f"Error processing the uploaded file: {e}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def dashboard_data(request):
    save_dir_json = "./api_data_json"
    total_uploads = 0  # number of files
    total_predictions = 0
    total_threats_detected = 0
    total_safe_entries = 0
    anomaly_distribution = defaultdict(int)
    detection_rate_over_time = defaultdict(int)

    try:
        # Loop through each prediction JSON file
        for filename in os.listdir(save_dir_json):
            if filename.startswith("api_input_data_") and filename.endswith(".json"):
                total_uploads += 1   # count file here
                file_path = os.path.join(save_dir_json, filename)
                with open(file_path, 'r') as f:
                    data_list = json.load(f)
                    total_predictions += len(data_list)
                    for entry in data_list:
                        predicted = entry.get('predicted', 'normal')
                        if predicted != 'normal':
                            total_threats_detected += 1
                            anomaly_distribution[predicted] += 1
                        else:
                            total_safe_entries += 1

                    timestamp_key = filename.replace("api_input_data_", "").replace(".json", "")
                    detection_rate_over_time[timestamp_key] = sum(
                        1 for entry in data_list if entry.get('predicted', 'normal') != 'normal'
                    )

        response_data = {
            "total_uploads": total_uploads,            # <-- now counts files, not predictions
            "threats_detected": total_threats_detected,
            "safe_entries": total_safe_entries,
            "anomalies": sum(anomaly_distribution.values()),
            "detection_rate_over_time": detection_rate_over_time,
            "anomaly_distribution": anomaly_distribution,
        }
        return JsonResponse(response_data)

    except Exception as e:
        print(f"Error in dashboard_data: {e}")
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
def list_reports(request):
    reports = []
    if os.path.exists(SAVE_DIR_JSON) and os.path.isdir(SAVE_DIR_JSON):
        for filename in os.listdir(SAVE_DIR_JSON):
            if filename.startswith("api_input_data_") and filename.endswith(".json"):
                reports.append(filename)
        return JsonResponse({'reports': reports}) # Wrap the list in a dictionary
    else:
        return JsonResponse({'reports': []})

@api_view(['GET'])
def get_report_data(request, filename):
    file_path = os.path.join(SAVE_DIR_JSON, filename)
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            return JsonResponse(data, safe=False)  # Added safe=False
    except FileNotFoundError:
        return JsonResponse({'error': 'Report not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Error decoding JSON'}, status=400)

@api_view(['GET'])
def get_models(request):
    models = MLModel.objects.filter(is_active=True)
    serializer = MLModelSerializer(models, many=True)
    return Response(serializer.data)

User = get_user_model()

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserDisplaySerializer
    permission_classes = [AllowAny] # Add this line