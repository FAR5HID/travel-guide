from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import TravelPartnerRequest, TravelPartnerComment
from .serializers import TravelPartnerRequestSerializer, TravelPartnerCommentSerializer


class TravelPartnerRequestViewSet(viewsets.ModelViewSet):
    queryset = TravelPartnerRequest.objects.all()
    serializer_class = TravelPartnerRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return (
            TravelPartnerRequest.objects.all()
            .select_related("user")
            .prefetch_related("comments")
        )

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, pk=None):
        travel_request = self.get_object()
        serializer = TravelPartnerCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, request=travel_request)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def perform_update(self, serializer):
        # Only allow editing by the owner
        if serializer.instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only edit your own submissions.")
        serializer.save()

    def perform_destroy(self, instance):
        # Only allow deletion by the owner
        if instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only delete your own submissions.")
        instance.delete()


class TravelPartnerCommentViewSet(viewsets.ModelViewSet):
    queryset = TravelPartnerComment.objects.all()
    serializer_class = TravelPartnerCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Only allow editing by the owner
        if serializer.instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only edit your own comments.")
        serializer.save()

    def perform_destroy(self, instance):
        # Only allow deletion by the owner
        if instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only delete your own comments.")
        instance.delete()

    def get_queryset(self):
        # Allow users to see their own comments, or all if admin
        user = self.request.user
        if user.is_staff:
            return TravelPartnerComment.objects.all()
        return TravelPartnerComment.objects.filter(user=user)
