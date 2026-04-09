import os
from flask import Flask
from flask_cors import CORS
from routes.auth import auth
from routes.payment import payment
from routes.start_detection import drowsiness    
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register Blueprint
app.register_blueprint(auth)
app.register_blueprint(payment)
app.register_blueprint(drowsiness)

if __name__ == '__main__':
    app.run(debug=True)
