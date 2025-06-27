from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Location, Route, Rating
from profile.models import Profile


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    mobile = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "password", "first_name", "last_name", "mobile")

    def create(self, validated_data):
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")
        mobile = validated_data.pop("mobile")
        user = User.objects.create_user(
            username=validated_data["username"], password=validated_data["password"]
        )
        Profile.objects.create(
            user=user, first_name=first_name, last_name=last_name, mobile=mobile
        )
        return user


class LocationSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_user_rating(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            rating = obj.ratings.filter(user=user).first()
            return rating.value if rating else None
        return None

    class Meta:
        model = Location
        fields = "__all__"
        extra_fields = ["user_rating"]


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "user", "location", "value", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
