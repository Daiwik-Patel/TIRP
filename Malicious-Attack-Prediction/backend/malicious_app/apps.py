from django.apps import AppConfig


class MaliciousAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'malicious_app'
