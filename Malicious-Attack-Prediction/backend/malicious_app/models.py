import torch
import torch.nn as nn
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings  


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

class MLModel(models.Model):
    MODEL_TYPES = (
        ('AE', 'Autoencoder'),
        ('RF', 'Random Forest'),
        ('SC', 'Scaler'),
        # Add more types as needed
    )

    name = models.CharField(max_length=255, unique=True, help_text="A unique name for the model (e.g., 'Anomaly Detection Autoencoder')")
    model_type = models.CharField(max_length=2, choices=MODEL_TYPES, help_text="The type of machine learning model")
    file_path = models.CharField(max_length=500, help_text="Relative path to the model file (e.g., 'model_output/autoencoder.pth')")
    # Store other relevant metadata
    accuracy = models.DecimalField(max_digits=5, decimal_places=4, null=True, blank=True, help_text="Accuracy or performance metric")
    version = models.CharField(max_length=50, default="1.0", help_text="Version of the model")
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text="Is this the currently active model for its type?")
    description = models.TextField(blank=True, help_text="A brief description of the model's purpose")
    metadata = models.JSONField(null=True, blank=True, help_text="Optional JSON field for additional model details (e.g., hyperparameters)")

    def get_full_file_path(self):
        """Constructs the absolute path to the model file."""
        # Assuming your 'model_output' directory is at the project root
        return os.path.join(settings.BASE_DIR, self.file_path)

    def __str__(self):
        return f"{self.name} (v{self.version}) - {self.model_type}"

    class Meta:
        verbose_name = "Machine Learning Model"
        verbose_name_plural = "Machine Learning Models"
        ordering = ['-created_at'] # Order by most recently created

