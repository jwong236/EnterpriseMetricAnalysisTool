from flask import Blueprint

bp = Blueprint("v1", __name__)

@bp.route("")
def index():
    return {
        "message" : "Hello from flask version 1"
    }

@bp.route("/matrix", methods=["POST"])
def getMatrix():
    return {
        "message" : "TODO"
    }