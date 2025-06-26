from django.db import models
from django.contrib.postgres.fields import ArrayField
from ckeditor.fields import RichTextField


class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="pics", blank=True, null=True)
    description = RichTextField(blank=True)
    rating = models.FloatField(default=0)
    district = models.CharField(max_length=100, db_index=True)
    category = ArrayField(models.CharField(max_length=100), blank=True, default=list)

    def __str__(self):
        if self.district == self.name:
            return self.name
        return f"{self.district} - {self.name} - {self.rating}"


class Route(models.Model):
    source = models.ForeignKey(Location, related_name="routes_from", on_delete=models.CASCADE)
    destination = models.ForeignKey(Location, related_name="routes_to", on_delete=models.CASCADE)
    travel_time = models.PositiveIntegerField()  # in minutes
    travel_cost = models.PositiveIntegerField()  # in BDT

    class Meta:
        unique_together = ("source", "destination")

    def __str__(self):
        return f"{self.source.name} - {self.destination.name}"
