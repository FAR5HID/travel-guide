from django.urls import path
from .views import ProfileDetailView, ProfileMeView

urlpatterns = [
    path("me/", ProfileMeView.as_view(), name="profile-me"),
    path("<str:username>/", ProfileDetailView.as_view(), name="profile-detail"),
]
