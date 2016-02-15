import string
from rest_framework.exceptions import ValidationError
from cravus.utils import IPThrottlePostMixin
from main import settings


class AccountThrottle(IPThrottlePostMixin):
    cache_name = "_accountviewset_post_count"
    throttle = settings.ACCOUNTVIEWSET_POST_THROTTLE
    detail = "You are only allowed to create %s accounts per day." % throttle


class Del:
    def __init__(self, keep=string.digits):
        self.comp = dict((ord(c), c) for c in keep)

    def __getitem__(self, k):
        return self.comp.get(k)


DD = Del()


def trim_mobile(mobile_number):
    if mobile_number is not None:
        mobile_digits_only = mobile_number.translate(DD)
        if len(mobile_digits_only) == 11:
            return mobile_digits_only
        elif len(mobile_digits_only) == 10:
            mobile_digits_only = '1' + mobile_digits_only
            return mobile_digits_only
        else:
            raise ValidationError("Invalid mobile number.")
    else:
        return ''
