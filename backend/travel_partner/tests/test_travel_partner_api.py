from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from travel_partner.models import TravelPartnerRequest


class TravelPartnerApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user", password="pass")
        self.client.force_authenticate(user=self.user)
        self.request_data = {
            "source": "চট্টগ্রাম",
            "destination": "কক্সবাজার",
            "member": 2,
            "budget": 5000,
            "tier": "1",
            "start_date": "2025-07-10",
            "end_date": "2025-07-15",
            "details": "Looking for a travel buddy.",
        }

    def test_create_request(self):
        resp = self.client.post("/api/travel-partner/requests/", self.request_data)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data["source"], self.request_data["source"])

    def test_list_requests(self):
        TravelPartnerRequest.objects.create(user=self.user, **self.request_data)
        resp = self.client.get("/api/travel-partner/requests/")
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(any(r["source"] == self.request_data["source"] for r in resp.data))

    def test_add_comment(self):
        req = TravelPartnerRequest.objects.create(user=self.user, **self.request_data)
        url = f"/api/travel-partner/requests/{req.id}/add_comment/"
        resp = self.client.post(url, {"text": "Nice!"})
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data["text"], "Nice!")

    def test_owner_edit_delete(self):
        req = TravelPartnerRequest.objects.create(user=self.user, **self.request_data)
        # Edit
        resp = self.client.patch(f"/api/travel-partner/requests/{req.id}/", {"details": "Updated details"})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["details"], "Updated details")
        # Delete
        resp = self.client.delete(f"/api/travel-partner/requests/{req.id}/")
        self.assertEqual(resp.status_code, 204)
