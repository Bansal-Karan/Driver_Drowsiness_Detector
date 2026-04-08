from flask import Flask
from flask_cors import CORS
from routes.auth import auth

app = Flask(__name__)
CORS(app)

# Register Blueprint
app.register_blueprint(auth)

if __name__ == '__main__':
    app.run(debug=True)