from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()

router.register('auth', views.AuthViewSet, basename='auth')
router.register('users', views.UserViewSet, basename='users')
router.register('topics', views.TopicViewSet, basename='topics')
router.register('posts', views.PostViewSet, basename='posts')
router.register('comments', views.CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(router.urls))
]
