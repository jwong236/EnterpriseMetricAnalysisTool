from flask import Blueprint

bp = Blueprint("mock", __name__)

@bp.route("")
def index():
    return {
        "message" : "hello from flask mock API"
    }