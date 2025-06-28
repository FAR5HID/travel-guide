from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TravelPartnerRequestViewSet, TravelPartnerCommentViewSet

router = DefaultRouter()
router.register(r"requests", TravelPartnerRequestViewSet, basename="travelpartnerrequest")
router.register(r"comments", TravelPartnerCommentViewSet, basename="travelpartnercomment")

urlpatterns = [
    path("", include(router.urls)),
]
