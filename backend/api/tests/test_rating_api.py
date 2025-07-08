from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Location


class RatingApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user", password="pass")
        self.client.force_authenticate(user=self.user)
        self.loc = Location.objects.create(name="A", district="D", category=["nature"], rating=5)

    def test_create_rating(self):
        resp = self.client.post("/api/rating/", {"location": self.loc.id, "value": 4})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["value"], 4)

    def test_update_rating(self):
        self.client.post("/api/rating/", {"location": self.loc.id, "value": 4})
        resp = self.client.post("/api/rating/", {"location": self.loc.id, "value": 5})
        self.assertEqual(resp.data["value"], 5)

    def test_delete_rating(self):
        self.client.post("/api/rating/", {"location": self.loc.id, "value": 4})
        resp = self.client.delete("/api/rating/", {"location": self.loc.id})
        self.assertEqual(resp.status_code, 200)
        self.assertIn("success", resp.data)

    def test_auth_required(self):
        self.client.force_authenticate(user=None)
        resp = self.client.post("/api/rating/", {"location": self.loc.id, "value": 4})
        self.assertEqual(resp.status_code, 401)
