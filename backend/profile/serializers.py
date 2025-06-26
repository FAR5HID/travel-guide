from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "username",
            "first_name",
            "last_name",
            "mobile",
            "district",
            "photo",
            "about_me",
        ]
        read_only_fields = ["user", "id", "username"]
