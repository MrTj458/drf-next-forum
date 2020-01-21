from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model, authenticate

from . import models


class UserSerializer(serializers.ModelSerializer):
    """Serializer for default django user"""
    email = serializers.EmailField(required=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for registering a new user"""
    email = serializers.EmailField(required=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """Serializer for user login information"""
    username = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, data):
        user = authenticate(**data)

        if not user or not user.is_active:
            raise serializers.ValidationError(
                {'authentication': ['Username or password is incorrect.']})

        return user


class TopicSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = models.Topic
        fields = ['id', 'title', 'author', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    """Serializer for the Post model"""
    author = UserSerializer(read_only=True)
    topic_id = serializers.PrimaryKeyRelatedField(
        read_only=True, source='topic')
    likes = serializers.IntegerField(source='get_like_count', read_only=True)
    liked_by_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Post
        fields = ['id', 'title', 'body', 'author',
                  'likes', 'liked_by_user', 'topic_id', 'created_at']
        read_only_fields = ['id']

    def get_liked_by_user(self, obj):
        request = self.context.get('request')
        if not request:
            raise Exception('Pass the request into PostSerializer!')

        user = request.user
        if request.user.is_anonymous:
            return False

        liked = obj.likes.filter(id=user.id).count() > 0
        if liked:
            return True

        return False


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    post_id = serializers.PrimaryKeyRelatedField(read_only=True, source='post')

    class Meta:
        model = models.Comment
        fields = ['id', 'body', 'author', 'post_id', 'created_at']
        read_only_fields = ['id']
