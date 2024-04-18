"""
This file is the entry of the flask app
"""


from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return {"message":"Hello, This is the message from Flask, stating that you can successfully get messages from the backend. Hurray!"}

