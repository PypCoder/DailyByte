from flask import Flask
from flask_cors import CORS
from app import api
run = Flask(__name__)
CORS(run)

run.register_blueprint(api)

if __name__ == '__main__':
    run.run(debug=True)
