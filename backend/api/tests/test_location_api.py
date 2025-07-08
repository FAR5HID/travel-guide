from rest_framework.test import APITestCase
from api.models import Location


class LocationApiTests(APITestCase):
    def setUp(self):
        self.loc1 = Location.objects.create(name="A", district="D", category=["nature"], rating=5)
        self.loc2 = Location.objects.create(name="B", district="D", category=["culture"], rating=4)

    def test_list_by_category(self):
        resp = self.client.get("/api/locations/?category=nature")
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(any(l["name"] == "A" for l in resp.data))

    def test_detail(self):
        resp = self.client.get(f"/api/locations/{self.loc1.id}/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["name"], "A")
