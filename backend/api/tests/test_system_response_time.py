import time
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from api.models import Location


class SystemResponseTimeTest(APITestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        # Create locations for testing
        self.locations = []
        for i in range(3):
            loc = Location.objects.create(
                name=f"Location{i}",
                district="TestDistrict",
                category=["nature"],
                rating=5.0,
            )
            self.locations.append(loc)

    def measure(self, method, url, data=None, auth=True, runs=3):
        times = []
        for _ in range(runs):
            start = time.perf_counter()
            if method == "get":
                response = self.client.get(url, data, format="json")
            elif method == "post":
                response = self.client.post(url, data, format="json")
            else:
                raise ValueError("Unsupported method")
            elapsed = (time.perf_counter() - start) * 1000
            times.append(elapsed)
        return sum(times) / len(times), max(times)

    def test_response_times(self):
        results = []
        # Route Suggestion
        payload = {
            "source": self.locations[0].name,
            "destination": self.locations[1].district,
            "budget": 10000,
            "start_date": "2025-07-08",
            "end_date": "2025-07-10",
            "category": None,
        }
        avg, mx = self.measure("post", "/api/route/", payload)
        results.append(("Route Suggestion", avg, mx))
        # Partner Finding (list requests)
        avg, mx = self.measure("get", "/api/travel-partner/requests/")
        results.append(("Partner Finding", avg, mx))
        # Locations by Category
        avg, mx = self.measure("get", f"/api/locations/?category=nature")
        results.append(("Locations by Category", avg, mx))
        # Location Details
        avg, mx = self.measure("get", f"/api/locations/{self.locations[0].id}/")
        results.append(("Location Details", avg, mx))
        print("\n{:<25} | {:>25} | {:>25}".format("Action", "Avg Response Time (ms)", "Max Response Time (ms)"))
        for action, avg, mx in results:
            print(f"{action:<25} | {avg:>25.2f} | {mx:>25.2f}")
