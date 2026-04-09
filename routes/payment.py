import os
import stripe
from flask import Flask, jsonify, Blueprint

print("ENV KEY:", os.getenv("STRIPE_SECRET_KEY"))
payment = Blueprint('payment', __name__)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
print("STRIPE KEY:", os.getenv("STRIPE_SECRET_KEY"))

@payment.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": "Drowsiness Detection Subscription",
                    },
                    "unit_amount": 49900,  # ₹499
                },
                "quantity": 1,
            }],
            success_url="http://localhost:3000/dashboard",
            cancel_url="http://localhost:3000/dashboard",
        )
        return jsonify({"url": session.url})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
