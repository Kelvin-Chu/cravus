import json
import traceback
from django.core.cache import cache
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
from io import BytesIO
from ipware.ip import get_ip
from rest_framework.exceptions import Throttled
from rest_framework.throttling import BaseThrottle


def check_img(image):
    if image is not None:
        try:
            if image.content_type not in ('image/jpeg', 'image/png', 'image/gif', 'image/mpo'):
                return 'Only jpeg, png, and gif formats are supported.'
            elif image.size > 10485760:
                return 'Image file too large ( > 10mb )'
            else:
                return None
        except Exception:
            pass
    return 'Unable to read image, try a different image'


def crop_img(image, crop):
    try:
        temp = Image.open(image)
        format = temp.format
        # Rotate image based off of exif data (used by mobile devices that automatically orients the picture)
        # http://www.lifl.fr/~damien.riquet/auto-rotating-pictures-using-pil.html
        try:
            exif = temp._getexif()
            orientation_key = 274
            if exif:
                if orientation_key in exif:
                    orientation = exif[orientation_key]
                    rotate_values = {3: 180, 6: 270, 8: 90}
                    if orientation in rotate_values:
                        temp = temp.rotate(rotate_values[orientation], expand=1)
        except Exception:
            pass
        extra = json.loads(crop)
        x = int(extra.get('x'))
        y = int(extra.get('y'))
        height = int(extra.get('height'))
        width = int(extra.get('width'))
        temp = temp.crop((x, y, x + width, y + height))
        # Django imagefield is a InMemoryUploadedFile, need to convert PIL image in order to save
        temp_io = BytesIO()
        temp.save(temp_io, format=format)
        return InMemoryUploadedFile(temp_io, None, image.name, 'image/' + format, temp_io.getbuffer().nbytes, None)
    except Exception:
        print(traceback.format_exc())
        return 'Unable to read image, try a different image'


class IPThrottlePostMixin(BaseThrottle):
    cache_name = '_ip_throttle'
    throttle = 25
    detail = "Only %s requests allowed per day." % throttle

    def allow_request(self, request, view):
        if request.POST:
            ip = get_ip(request)
            if ip is not None:
                name = str(ip)
                count = cache.get(name + self.cache_name, 0)
                if count >= self.throttle:
                    raise Throttled(detail=self.detail)
                else:
                    count += 1
                    cache.set(name + self.cache_name, count, 24 * 60 * 60)
        return True
