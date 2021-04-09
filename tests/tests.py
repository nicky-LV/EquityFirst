from django.test import TestCase
from API.models import Channels, Groups
from django.utils.crypto import get_random_string

class ModelTests(TestCase):

    def test_channel_groups(self):
        """
        Tests models for registering Channels and Groups as expected
        """

        # Create groups
        group_1 = Groups.objects.create(name="group_1")
        group_2 = Groups.objects.create(name="group_2")
        group_3 = Groups.objects.create(name="group_3")

        # Websocket connection successful, creates channel representing user.
        channel = Channels.objects.create(get_random_string(5))
