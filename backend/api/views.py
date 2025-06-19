from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from .utils import find_route
from .models import Location
from .serializers import LocationSerializer, UserSerializer


class SignupView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data["token"])
        return Response({"token": token.key, "user_id": token.user_id})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=204)


class RouteView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        source = request.data.get("source")
        destination = request.data.get("destination")
        budget = request.data.get("budget")
        days = request.data.get("days")
        category = request.data.get("category")

        route_locations = find_route(source, destination, budget, days, category)
        serializer = LocationSerializer(route_locations, many=True)
        return Response({"route": serializer.data})
