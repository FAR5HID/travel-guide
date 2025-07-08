from datetime import datetime

from django.contrib.auth.models import User
from django.db import models
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Location, Rating
from .serializers import LocationSerializer, RatingSerializer, UserSerializer
from .utils import find_route


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = self.get_queryset().get(pk=response.data["id"])
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data["token"])
        return Response({"token": token.key})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=204)


class RouteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        source = request.data.get("source")
        destination = request.data.get("destination")
        budget = request.data.get("budget")
        tier = request.data.get("tier")
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        category = request.data.get("category")

        # Calculate days from start_date and end_date
        days = None
        if start_date and end_date:
            try:
                d1 = datetime.strptime(start_date, "%Y-%m-%d")
                d2 = datetime.strptime(end_date, "%Y-%m-%d")
                if d2 < d1:
                    return Response(
                        {"error": "End date must be after start date."}, status=400
                    )
                days = (d2 - d1).days + 1
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # Apply tier divisor if both budget and tier are provided
        if budget:
            try:
                budget = float(budget)
                if tier:
                    budget = budget / float(tier)
            except ValueError:
                return Response(
                    {"error": "Budget and tier must be numbers."}, status=400
                )
        else:
            budget = None

        route_locations = find_route(source, destination, budget, days, category)
        serializer = LocationSerializer(
            route_locations, many=True, context={"request": request}
        )
        return Response({"route": serializer.data})


class LocationListByCategoryView(generics.ListAPIView):
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category = self.request.query_params.get("category")
        qs = Location.objects.exclude(name=models.F("district"))
        if category:
            qs = qs.filter(category__contains=[category])
        return qs.order_by("-rating")


class LocationDetailView(generics.RetrieveAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class RatingView(generics.GenericAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        location_id = request.data.get("location")
        value = request.data.get("value")
        if not location_id or not value:
            return Response(
                {"error": "location and value required"},
                status=400,
            )
        try:
            location = Location.objects.get(pk=location_id)
        except Location.DoesNotExist:
            return Response({"error": "Location not found"}, status=404)
        rating, created = Rating.objects.update_or_create(
            user=request.user,
            location=location,
            defaults={"value": value},
        )
        self._update_location_rating(location)
        return Response(RatingSerializer(rating).data)

    def delete(self, request, *args, **kwargs):
        location_id = request.data.get("location")
        if not location_id:
            return Response(
                {"error": "location required"},
                status=400,
            )
        try:
            location = Location.objects.get(pk=location_id)
        except Location.DoesNotExist:
            return Response({"error": "Location not found"}, status=404)
        try:
            rating = Rating.objects.get(user=request.user, location=location)
            rating.delete()
            self._update_location_rating(location)
            return Response({"success": True})
        except Rating.DoesNotExist:
            return Response({"error": "Rating not found"}, status=404)

    def _update_location_rating(self, location):
        ratings = location.ratings.all()
        avg = ratings.aggregate(models.Avg("value"))["value__avg"] or 0
        location.rating = avg
        location.save()
