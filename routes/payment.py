import os
import stripe
from flask import Flask, jsonify, Blueprint, request
from db import users_collection
from datetime import datetime, timezone, timedelta

payment = Blueprint('payment', __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@payment.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "inr",
                        "product_data": {
                            "name": "Drowsiness Detection Subscription",
                        },
                        "unit_amount": 49900,  # ₹499
                    },
                    "quantity": 1,
                }
            ],
            success_url="http://localhost:3000/dashboard?success=true",
            cancel_url="http://localhost:3000/dashboard?canceled=true",
        )
        return jsonify({"url": session.url})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@payment.route("/payment-success", methods=["POST"])
def payment_success():
    data = request.json
    email = data.get("email")
    print(data)
    # find user in DB and update subscription status
    user = users_collection.find_one({"email": email})

    if user:
        start = datetime.now(timezone.utc)
        end = start + timedelta(days=30)

        users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "isSubscribed": True,
                    "subscriptionStart": start,
                    "subscriptionEnd": end,
                }
            },
        )

    return jsonify({"message": "Subscription activated"})


@payment.route("/check-subscription", methods=["POST"])
def check_subscription():
    try:
        data = request.json
        email = data.get("email")

        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"access": False})

        sub_end = user.get("subscriptionEnd")

        if sub_end:
            # make it timezone-aware
            if sub_end.tzinfo is None:
                sub_end = sub_end.replace(tzinfo=timezone.utc)

            if datetime.now(timezone.utc) < sub_end:
                return jsonify({"access": True})

        return jsonify({"access": False})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
