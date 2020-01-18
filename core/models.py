from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model


class Topic(models.Model):
    title = models.CharField(max_length=255, unique=True)
    author = models.ForeignKey(get_user_model(), models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    likes = models.ManyToManyField(get_user_model(), related_name='likes')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    def get_like_count(self):
        return self.likes.count()

    def like(self, user):
        liked = self.likes.filter(id=user.id).count() > 0

        if liked:
            self.likes.remove(user)
        else:
            self.likes.add(user)

        self.save()


class Comment(models.Model):
    body = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
