from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Location


class RouteApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user", password="pass")
        self.client.force_authenticate(user=self.user)
        self.loc1 = Location.objects.create(name="A", district="D", category=["nature"], rating=5)
        self.loc2 = Location.objects.create(name="B", district="D", category=["nature"], rating=4)

    def test_valid_route(self):
        payload = {
            "source": self.loc1.name,
            "destination": self.loc2.district,
            "budget": 10000,
            "start_date": "2025-07-08",
            "end_date": "2025-07-10",
            "category": None,
        }
        resp = self.client.post("/api/route/", payload, format="json")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("route", resp.data)

    def test_invalid_source(self):
        payload = {
            "source": "Nonexistent",
            "destination": self.loc2.district,
            "budget": 10000,
            "start_date": "2025-07-08",
            "end_date": "2025-07-10",
            "category": None,
        }
        resp = self.client.post("/api/route/", payload, format="json")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["route"], [])
