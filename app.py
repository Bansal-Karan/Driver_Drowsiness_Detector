import os
from flask import Flask
from flask_cors import CORS
from routes.auth import auth
from routes.payment import payment
from routes.start_detection import drowsiness   
from routes.admin_dash import admin 
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ------------------------------------------------------------------------------------
# Admin Credentials seeding

# from db import users_collection
# from werkzeug.security import generate_password_hash


# def create_admin():
#     admin_email = os.getenv("ADMIN_EMAIL")
#     admin_password = os.getenv("ADMIN_PASSWORD")

#     existing_admin = users_collection.find_one({"email": admin_email})

#     if not existing_admin:
#         users_collection.insert_one(
#             {
#                 "name": "Admin",
#                 "email": admin_email,
#                 "password": generate_password_hash(admin_password),
#                 "isAdmin": True,
#             }
#         )
#         print("Admin created")


# create_admin()
# ----------------------------------------------------------------------------

# Register Blueprint
app.register_blueprint(auth)
app.register_blueprint(payment)
app.register_blueprint(drowsiness)
app.register_blueprint(admin)

if __name__ == '__main__':
    app.run(debug=True)
