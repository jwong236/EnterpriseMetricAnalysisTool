from flask import Blueprint, request
import services.matrix.service as s

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
    startDate = data["startDate"]
    endDate = data["endDate"]
    res = s.metric()
    return {
        "message" : "TODO",
        "data" : res,
    }