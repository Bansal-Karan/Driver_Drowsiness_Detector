from flask import Blueprint, request, jsonify
from db import users_collection
from models.User_model import admin_schema, register_schema
from models.User_model import login_schema
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint("auth", __name__)


# Register
@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed_password = generate_password_hash(data["password"])
    user = register_schema(data)
    user["password"] = hashed_password
    users_collection.insert_one(user)

    return jsonify({"message": "User registered"})


# Login
@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    user_data = login_schema(data)

    user = users_collection.find_one({"email": user_data["email"]})

    if user and check_password_hash(user["password"], user_data["password"]):
        return jsonify(
            {
                "message": "Login successful",
                "name": user["name"],
                "email": user["email"],
                "subscriptionEnd": user.get("subscriptionEnd"),
            }
        )
    else:
        return jsonify({"message": "Invalid credentials"}), 401


# admin login
@auth.route("/admin", methods=["POST"])
def admin_login():
    data = request.json

    user = users_collection.find_one({"email": data["email"]})

    if (
        user
        and user.get("isAdmin")
        and check_password_hash(user["password"], data["password"])
    ):
        return jsonify({"message": "Admin login successful", "name": user["name"], "email": user["email"]})

    return jsonify({"message": "Invalid admin credentials"}), 401
