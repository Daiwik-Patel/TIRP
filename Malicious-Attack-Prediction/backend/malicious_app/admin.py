from django.contrib import admin
from .models import MLModel # Assuming MLModel is in models.py of the same app

@admin.register(MLModel)
class MLModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'model_type', 'file_path', 'is_active', 'version', 'created_at')
    list_filter = ('model_type', 'is_active')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'last_updated')
    fieldsets = (
        (None, {
            'fields': ('name', 'model_type', 'file_path', 'description', 'is_active')
        }),
        ('Performance & Versioning', {
            'fields': ('accuracy', 'version', 'metadata'),
            'classes': ('collapse',) # Optional: makes this section collapsible in admin
        }),
        ('Timestamps', {
            'fields': ('created_at', 'last_updated'),
            'classes': ('collapse',)
        }),
    )