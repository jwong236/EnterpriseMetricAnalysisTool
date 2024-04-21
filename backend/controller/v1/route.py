from flask import Blueprint, request

bp = Blueprint("v1", __name__)

@bp.route("")
def index():
    return {
        "message" : "Hello from flask version 1"
    }

# main metric compaired with other metrics
@bp.route("/matrix", methods=["POST"])
def getMatrix():
    data = request.json
    print(data)
    return {
        "message" : "TODO"
    }