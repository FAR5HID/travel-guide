from django.urls import path
from .views import (
    SignupView,
    LoginView,
    LogoutView,
    RouteView,
    LocationListByCategoryView,
    LocationDetailView,
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("route/", RouteView.as_view(), name="route"),
    path("locations/", LocationListByCategoryView.as_view(), name="locations-by-category"),
    path("locations/<int:pk>/", LocationDetailView.as_view(), name="location-detail"),
]
