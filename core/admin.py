from django.contrib import admin

from . import models

admin.site.register(models.Topic)
admin.site.register(models.Post)
admin.site.register(models.Comment)
