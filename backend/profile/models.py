from django.conf import settings
from django.db import models
from ckeditor.fields import RichTextField


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    mobile = models.CharField(max_length=20)
    district = models.CharField(max_length=100, blank=True)
    photo = models.ImageField(upload_to="profile_photos/", blank=True, null=True)
    about_me = RichTextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.username})"
