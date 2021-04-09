from django.db import models


class Channels(models.Model):
    name = models.CharField(unique=True, null=False, max_length=50)
    group = models.ForeignKey('Groups', on_delete=models.CASCADE)


class Groups(models.Model):
    name = models.CharField(unique=True, null=False, max_length=50)