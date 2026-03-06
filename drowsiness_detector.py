import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

LEFT_EYE = [33, 160, 158, 133, 153, 144]

cap = cv2.VideoCapture(0)

def calculate_EAR(eye_points):
    p1, p2, p3, p4, p5, p6 = eye_points

    vertical1 = np.linalg.norm(p2 - p6)
    vertical2 = np.linalg.norm(p3 - p5)
    horizontal = np.linalg.norm(p1 - p4)

    ear = (vertical1 + vertical2) / (2.0 * horizontal)
    return ear

EAR_THRESHOLD = 0.21
CONSEC_FRAMES = 35
counter = 0

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
            for idx in LEFT_EYE:
                x = int(face_landmarks.landmark[idx].x * w)
                y = int(face_landmarks.landmark[idx].y * h)
                eye_coords.append(np.array([x, y]))
                cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

            # Calculate EAR
            ear = calculate_EAR(eye_coords)

            # Show EAR on screen
            cv2.putText(frame, f"EAR: {ear:.2f}", (30, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

            # Drowsiness logic
            if ear < EAR_THRESHOLD:
                counter += 1
            else:
                counter = 0

            if counter >= CONSEC_FRAMES:
                cv2.putText(frame, "DROWSINESS ALERT!", (50, 100),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
                

    cv2.imshow("Driver Drowsiness Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()