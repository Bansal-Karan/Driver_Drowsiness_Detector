from flask import Blueprint, Response
import drowsiness_detector

drowsiness = Blueprint("drowsiness", __name__)


@drowsiness.route("/start-drowsiness", methods=["POST"])
def start_drowsiness():
    drowsiness_detector.start_detection()
    return {"message": "Drowsiness detection started"}


@drowsiness.route("/stop-drowsiness", methods=["POST"])
def stop_drowsiness():
    drowsiness_detector.stop_detection()
    return {"message": "Drowsiness detection stopped"}


@drowsiness.route("/video_feed")
def video_feed():
    return Response(
        drowsiness_detector.generate(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )
