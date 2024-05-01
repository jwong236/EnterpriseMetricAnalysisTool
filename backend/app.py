"""
This file is the entry of the flask app
"""


from flask import Flask
from flask_cors import CORS
from controller.v1.route import bp as v1_blueprint
from controller.mock.route import bp as mock_blueprint
from controller.raw_metrics.route import bp as raw_metrics_blueprint

app = Flask(__name__)
CORS(app)
app.register_blueprint(v1_blueprint, url_prefix="/v1")
app.register_blueprint(mock_blueprint, url_prefix="/mock")
app.register_blueprint(raw_metrics_blueprint, url_prefix="/raw_metrics")

if __name__ == "__main__":
    app.run(debug=True)
