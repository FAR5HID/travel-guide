from django.contrib import admin
from .models import TravelPartnerRequest, TravelPartnerComment


@admin.register(TravelPartnerRequest)
class TravelPartnerRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "source",
        "destination",
        "budget",
        "member",
        "created_at",
    )
    search_fields = ("source", "destination", "user__username")
    list_filter = ("source", "destination", "created_at")


@admin.register(TravelPartnerComment)
class TravelPartnerCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "request", "user", "created_at")
    search_fields = ("request__source", "request__destination", "user__username")
    list_filter = ("created_at",)
