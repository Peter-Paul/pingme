from django.db import models
import uuid

class Stream(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title 				= models.CharField(max_length=50, null=False, blank=False)
    description 		= models.TextField(max_length=5000, null=False, blank=False)
    tone 				= models.CharField(max_length=50, null=False, blank=False)
    date_published 		= models.DateTimeField(auto_now_add=True, verbose_name="date published")
    date_updated 		= models.DateTimeField(auto_now=True, verbose_name="date updated")
    owner 				= models.CharField(max_length=100, null=False, blank=False)

    def __str__(self):
        return self.id

class Notifications(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stream 			    = models.ForeignKey(Stream, null=True, on_delete=models.SET_NULL)
    title 				= models.CharField(max_length=50, null=False, blank=False)
    description 		= models.TextField(max_length=5000, null=False, blank=False)
    date_published 		= models.DateTimeField(auto_now_add=True, verbose_name="date published")
    date_updated 		= models.DateTimeField(auto_now=True, verbose_name="date updated")

    def __str__(self):
        return self.title