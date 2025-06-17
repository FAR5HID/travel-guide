from django.contrib import admin
from .models import Location, Route


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("name", "district", "rating")  # sortable columns
    search_fields = ("name", "district")  # search bar
    list_filter = ("district",)  # filter sidebar


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ("source_name", "destination_name", "travel_time", "travel_cost")
    search_fields = ("source__name", "destination__name")
    list_filter = ("source__district",)

    def source_name(self, obj):
        return obj.source.name

    source_name.short_description = "Source"

    def destination_name(self, obj):
        return obj.destination.name

    destination_name.short_description = "Destination"
