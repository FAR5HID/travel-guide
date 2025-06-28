from rest_framework import serializers
from .models import TravelPartnerRequest, TravelPartnerComment


class TravelPartnerCommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TravelPartnerComment
        fields = ["id", "user", "text", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class TravelPartnerRequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    comments = TravelPartnerCommentSerializer(many=True, read_only=True)

    class Meta:
        model = TravelPartnerRequest
        fields = [
            "id",
            "user",
            "source",
            "destination",
            "member",
            "budget",
            "tier",
            "start_date",
            "end_date",
            "category",
            "details",
            "created_at",
            "updated_at",
            "comments",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at", "comments"]
