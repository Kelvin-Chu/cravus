from authentication.serializers import AccountSerializer


def jwt_response_payload_handler(token, user=None, request=None):
    return {'token': token, 'user': AccountSerializer(user).data}
