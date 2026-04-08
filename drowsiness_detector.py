import cv2
import mediapipe as mp
import numpy as np
from playsound import playsound
from tensorflow.keras.models import load_model

# Load trained CNN model
model = load_model("eye_model.h5")

# MediaPipe setup
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

# Left eye landmarks
LEFT_EYE = [33, 160, 158, 133, 153, 144]

# Right eye landmarks (ADD THIS)
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

# Webcam
cap = cv2.VideoCapture(0)

# Drowsiness logic
counter = 0
CONSEC_FRAMES = 20   # adjust if needed

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:

            h, w, _ = frame.shape
            eye_coords = []

            # Get eye points
            eyes = [LEFT_EYE, RIGHT_EYE]
            closed_count = 0

            for eye in eyes:
                eye_coords = []

                for idx in eye:
                    x = int(face_landmarks.landmark[idx].x * w)
                    y = int(face_landmarks.landmark[idx].y * h)
                    eye_coords.append(np.array([x, y]))

                    cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

                # Crop
                x_min = min([p[0] for p in eye_coords])
                x_max = max([p[0] for p in eye_coords])
                y_min = min([p[1] for p in eye_coords])
                y_max = max([p[1] for p in eye_coords])

                eye_crop = frame[y_min:y_max, x_min:x_max]

                if eye_crop.size == 0:
                    continue

                # Preprocess
                eye_crop = cv2.resize(eye_crop, (24, 24))
                eye_crop = cv2.cvtColor(eye_crop, cv2.COLOR_BGR2GRAY)
                eye_crop = eye_crop / 255.0
                eye_crop = eye_crop.reshape(1, 24, 24, 1)

                # Predict
                prediction = model.predict(eye_crop, verbose=0)

                if prediction > 0.7:
                    closed_count += 1

            # Final decision
            if closed_count == 2:
                counter += 1
                status = "Closed"
            else:
                counter = 0
                status = "Open"

            # display status
            cv2.putText(frame, f"Eye: {status}", (30, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

            # ---- ALERT ----
            if counter >= CONSEC_FRAMES:
                cv2.putText(frame, "DROWSINESS ALERT!", (50, 100),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)

                playsound("alarm.wav")

    cv2.imshow("Drowsiness Detection (CNN)", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()