from authentication.serializers import AccountSerializer
from cravus.utils import IPThrottlePostMixin
from main import settings


def jwt_response_payload_handler(token, user=None, request=None):
    return {'token': token, 'user': AccountSerializer(user).data}


class AccountThrottle(IPThrottlePostMixin):
    cache_name = "_accountviewset_post_count"
    throttle = settings.ACCOUNTVIEWSET_POST_THROTTLE
    detail = "You are only allowed to create %s accounts per day." % throttle
