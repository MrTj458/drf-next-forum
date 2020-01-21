from rest_framework.permissions import BasePermission


class OwnsObjectOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve']:
            return True
        elif view.action in ['posts', 'comments'] and request.method == 'GET':
            return True
        else:
            return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if obj.author == request.user:
            return True
        return False
