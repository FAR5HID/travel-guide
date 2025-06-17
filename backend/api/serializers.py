from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Location, Route


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"], password=validated_data["password"]
        )
        return user


class SpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class EdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = "__all__"
