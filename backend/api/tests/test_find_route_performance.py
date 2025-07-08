import logging
import time
from django.test import TestCase
from api.models import Location, Route
from api.utils import find_route

logging.disable(logging.CRITICAL)


class FindRoutePerformanceTest(TestCase):
    def setUp_locations_and_routes(self, n):
        locations = []
        for i in range(n):
            loc = Location.objects.create(
                name=f"Location{i}",
                district="TestDistrict",
                category=["nature"],
                rating=5.0,
            )
            locations.append(loc)
        # Branching: each i connects to i+1 and i+2 (if they exist)
        for i in range(n):
            for j in range(1, 3):
                if i + j < n:
                    Route.objects.create(
                        source=locations[i],
                        destination=locations[i + j],
                        travel_time=60,
                        travel_cost=100,
                    )
        return locations

    def measure_route_time(self, source, destination, budget, days, category, runs=5):
        times = []
        for _ in range(runs):
            start = time.perf_counter()
            r = find_route(source, destination, budget, days, category)
            end = time.perf_counter()
            times.append((end - start) * 1000)  # ms
        avg_time = sum(times) / len(times)
        max_time = max(times)
        return avg_time, max_time

    def test_performance(self):
        results = []
        for n in [10, 25, 50]:
            Location.objects.all().delete()
            Route.objects.all().delete()
            locations = self.setUp_locations_and_routes(n)
            source = locations[0].name
            destination_district = locations[-1].district
            avg_time, max_time = self.measure_route_time(
                source=source,
                destination=destination_district,
                budget=10000,
                days=5,
                category=None,
                runs=5,
            )
            results.append((n, avg_time, max_time))
        print("\nNumber of Locations | Average Route Finding Time (ms) | Max Route Finding Time (ms)")
        for n, avg_time, max_time in results:
            print(f"{n:>19} | {avg_time:>30.2f} | {max_time:>27.2f}")
