from django.db import models
from django.conf import settings


class TravelPartnerRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="travel_partner_requests")
    source = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    member = models.PositiveIntegerField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    tier = models.CharField(max_length=50, blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username}: {self.source} → {self.destination} ({self.start_date} - {self.end_date})"


class TravelPartnerComment(models.Model):
    request = models.ForeignKey(TravelPartnerRequest, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment by {self.user.username} on {self.request}"
