# Drowsiness Detection System

## Overview
This project implements a real-time drowsiness detection system using computer vision techniques. It monitors a user's eye movements to detect signs of drowsiness and triggers an alarm if prolonged eye closure is detected. The system leverages MediaPipe for face mesh detection and OpenCV for video processing and display.

## Features
- Real-time eye aspect ratio (EAR) calculation.
- Drowsiness detection based on consecutive frames of closed eyes.
- Non-blocking audio alarm to alert the user.
- Visual feedback on screen, displaying the EAR value and drowsiness alerts.

## Installation
To set up and run this project, follow these steps:

1.  **Clone the repository (if applicable):**
    ```bash
    git clone https://github.com/Bansal-Karan/Driver_Drowsiness_Detector.git
    cd drowsiness_detector.py
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the required Python packages:**
    ```bash
    pip install opencv-python mediapipe numpy playsound
    ```

4.  **Prepare the alarm sound:**
    Place an audio file named `alarm.wav` in the same directory as the `drowsiness_detector_improved.py` script. This file will be played when drowsiness is detected.

## Usage
To run the drowsiness detection system, execute the Python script:

```bash
python drowsiness_detector_improved.py
```

-   The system will start capturing video from your default webcam.
-   The Eye Aspect Ratio (EAR) will be displayed on the screen.
-   If drowsiness is detected (eyes closed for a specified number of consecutive frames), a "DROWSINESS ALERT!" message will appear, and an audible alarm will play.
-   Press `q` to quit the application.

## Technical Details

### Eye Aspect Ratio (EAR)
The Eye Aspect Ratio is a metric used to quantify the openness of the eyes. It is calculated using the distances between specific facial landmarks around the eyes. A lower EAR value indicates that the eye is more closed.

The formula for EAR is typically given by:

$$ EAR = \frac{||p_2 - p_6|| + ||p_3 - p_5||}{2 \cdot ||p_1 - p_4||} $$

Where $p_1, \dots, p_6$ are 2D facial landmark coordinates for the eye.

### MediaPipe Face Mesh
MediaPipe Face Mesh is a machine learning solution that estimates 468 3D facial landmarks in real-time. This project uses these landmarks to accurately track the eyes.

### Non-blocking Alarm
To prevent the alarm sound from freezing the video feed, the `playsound` function is executed in a separate thread using Python's `threading` module. This ensures that the main video processing loop continues to run uninterrupted while the alarm is playing.

## Configuration
-   `EAR_THRESHOLD`: The threshold below which the EAR is considered indicative of a closed eye (default: 0.21).
-   `CONSEC_FRAMES`: The number of consecutive frames for which the EAR must be below the threshold to trigger a drowsiness alert (default: 35).

## Contributing
Feel free to fork the repository, make improvements, and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
