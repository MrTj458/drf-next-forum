from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Post, Comment, Topic
from .serializers import PostSerializer, LoginSerializer, UserSerializer, \
    CommentSerializer, TopicSerializer, RegisterSerializer
from .permissions import OwnsObjectOrReadOnly


class TopicViewSet(ViewSet):
    """Topics"""
    permission_classes = [OwnsObjectOrReadOnly]

    def list(self, request):
        """Get all topics"""
        topics = Topic.objects.all()
        serialized_topics = TopicSerializer(topics, many=True)
        return Response({'topics': serialized_topics.data})

    def retrieve(self, request, pk=None):
        """Get a topic"""
        topic = get_object_or_404(Topic, pk=pk)
        serialized_topic = TopicSerializer(topic)
        return Response({
            'topic': serialized_topic.data,
        })

    def create(self, request):
        """Create a topic"""
        serialized_topic = TopicSerializer(data=request.data)
        serialized_topic.is_valid(raise_exception=True)
        serialized_topic.save(author=request.user)
        return Response({
            'topic': serialized_topic.data,
        })

    def update(self, request, pk=None):
        """Update a topic"""
        topic = get_object_or_404(Topic, pk=pk)
        self.check_object_permissions(request, topic)

        serialized_topic = TopicSerializer(topic, data=request.data)
        serialized_topic.is_valid(raise_exception=True)
        serialized_topic.save()

        return Response({
            'topic': serialized_topic.data,
        })

    def destroy(self, request, pk=None):
        """Delete a topic"""
        topic = get_object_or_404(Topic, pk=pk)
        self.check_object_permissions(request, topic)
        topic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get', 'post'], detail=True)
    def posts(self, request, pk=None):
        topic = get_object_or_404(Topic, pk=pk)

        if request.method == 'POST':
            """Create a post for a topic"""
            serialized_post = PostSerializer(
                data=request.data, context={'request': request})
            serialized_post.is_valid(raise_exception=True)
            serialized_post.save(author=request.user, topic=topic)
            serialized_post.instance.like(request.user)
            return Response({
                'post': serialized_post.data,
            })
        else:
            """Get posts for a topic"""
            posts = topic.post_set.all()
            serialized_posts = PostSerializer(
                posts, many=True, context={'request': request})
            return Response({
                'posts': serialized_posts.data
            })


class PostViewSet(ViewSet):
    """Posts"""
    permission_classes = [OwnsObjectOrReadOnly]

    def retrieve(self, request, pk=None):
        """Get a post"""
        post = get_object_or_404(Post, pk=pk)
        serialized_post = PostSerializer(post, context={'request': request})

        return Response({
            'post': serialized_post.data,
        })

    def update(self, request, pk=None):
        """Update a post"""
        post = get_object_or_404(Post, pk=pk)
        self.check_object_permissions(request, post)

        serialized_post = PostSerializer(
            post, data=request.data, context={'request': request})
        serialized_post.is_valid(raise_exception=True)
        serialized_post.save()
        return Response({
            'post': serialized_post.data,
        })

    def destroy(self, request, pk=None):
        """Delete a post"""
        post = get_object_or_404(Post, pk=pk)
        self.check_object_permissions(request, post)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post'], detail=True)
    def like(self, request, pk=None):
        """Like a post"""
        post = get_object_or_404(Post, pk=pk)
        post.like(request.user)
        serialized_post = PostSerializer(post, context={'request': request})
        return Response({
            'post': serialized_post.data,
        })

    @action(methods=['get', 'post'], detail=True)
    def comments(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)

        if request.method == 'POST':
            """Add a comment to a post"""
            serialized_comment = CommentSerializer(data=request.data)
            serialized_comment.is_valid(raise_exception=True)
            serialized_comment.save(post=post, author=request.user)

            return Response({
                'comment': serialized_comment.data,
            })
        else:
            """Return comments for a post"""
            comments = post.comment_set.all()
            serialized_comments = CommentSerializer(comments, many=True)
            return Response({
                'comments': serialized_comments.data,
            })


class CommentViewSet(ViewSet):
    """Comments"""
    permission_classes = [OwnsObjectOrReadOnly]

    def retrieve(self, request, pk=None):
        """Get a comment"""
        comment = get_object_or_404(Comment, pk=pk)
        serialized_comment = CommentSerializer(comment)
        return Response({
            'comment':  serialized_comment.data,
        })

    def update(self, request, pk=None):
        """Update a comment"""
        comment = get_object_or_404(Comment, pk=pk)
        self.check_object_permissions(request, comment)
        serialized_comment = CommentSerializer(comment, data=request.data)
        serialized_comment.is_valid(raise_exception=True)
        serialized_comment.save()
        return Response({
            'comment': serialized_comment.data,
        })

    def destroy(self, request, pk=None):
        """Delete a comment"""
        comment = get_object_or_404(Comment, pk=pk)
        self.check_object_permissions(request, comment)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(ViewSet):
    """Users"""

    def create(self, request):
        """Register a new user"""
        serialized_user = RegisterSerializer(data=request.data)
        serialized_user.is_valid(raise_exception=True)
        user = serialized_user.save()
        return Response({
            'user': UserSerializer(user).data,
            'token': Token.objects.create(user=user).key,
        })

    def update(self, request, pk=None):
        user = request.user

        serialized_user = UserSerializer(user, data=request.data)
        serialized_user.is_valid(raise_exception=True)
        serialized_user.save()
        return Response({
            'user': serialized_user.data,
        })


class AuthViewSet(ViewSet):
    """Auth"""

    def list(self, request):
        """Get current user with token"""
        if request.user.is_anonymous:
            return Response({'user': {}})

        serialized_user = UserSerializer(request.user)
        return Response({'user': serialized_user.data})

    def create(self, request):
        """Authenticate and get token (log in)"""
        serialized_user = LoginSerializer(data=request.data)
        serialized_user.is_valid(raise_exception=True)
        user = serialized_user.validated_data
        Token.objects.get(user=user).delete()
        return Response({
            'user': UserSerializer(user).data,
            'token': Token.objects.create(user=user).key,
        })
