from flask import Blueprint, request, jsonify
from db import users_collection

admin = Blueprint("admin", __name__)


@admin.route("/admin-dashboard", methods=["POST"])
def admin_dashboard():
    email = request.json.get("email")

    user = users_collection.find_one({"email": email})

    if not user or not user.get("isAdmin"):
        return jsonify({"error": "Unauthorized"}), 403

    total_users = users_collection.count_documents({})
    total_subscribers = users_collection.count_documents({"isSubscribed": True})

    subscribers = list(
        users_collection.find(
            {"isSubscribed": True},
            {"_id": 0, "name": 1, "email": 1, "subscriptionEnd": 1, "usage_count": 1},
        )
    )

    return jsonify(
        {
            "total_users": total_users,
            "total_subscribers": total_subscribers,
            "subscribers": subscribers,
        }
    )
