from cravus.utils import IPThrottlePostMixin
from main import settings


class DishThrottle(IPThrottlePostMixin):
    cache_name = "_dishviewset_post_count"
    throttle = settings.DISHVIEWSET_POST_THROTTLE
    detail = "Only %s new dishes allowed per day." % settings.DISHVIEWSET_POST_THROTTLE
