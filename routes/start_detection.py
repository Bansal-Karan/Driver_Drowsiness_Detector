import subprocess
from flask import Blueprint, jsonify

drowsiness = Blueprint('drowsiness', __name__)

@drowsiness.route("/start-drowsiness", methods=["POST"])
def start_drowsiness():
    try:
        subprocess.Popen(["python", "drowsiness_detector.py"])
        return jsonify({"message": "Drowsiness detection started"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500