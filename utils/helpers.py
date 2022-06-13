from pathlib import Path
from rest_framework.response import Response
from django.core.files.images import get_image_dimensions
from utils.validators import is_image


def delete_media(path_):
    """ delete media file if it exists
    """
    f = Path(path_)
    if f.exists():
        f.unlink()


def non_field_response(msg = ""):
    return Response({ 'non_field_errors': [msg] },status=400)


def set_image_dimensions(model,field_name):
    """
        field  must be a  FileField
        The model must have width and height fields 
    """
    file = getattr(model,field_name)
    if is_image(file.name):
        width, height = get_image_dimensions(file)
        model.width = width         
        model.height = height         
        model.save()