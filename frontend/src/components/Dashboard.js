import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleSubscribe = async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/create-checkout-session", {
                method: "POST",
            });

            const data = await res.json();
            console.log("DATA:", data);

            if (!data.url) {
                alert("Payment error");
                return;
            }

            window.location.href = data.url;

        } catch (err) {
            console.error(err);
            alert("Error redirecting to payment");
        }
    };


    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>

            {/* Title */}
            <h1>Drowsiness Detection System</h1>

            {/* Description */}
            <p style={{ maxWidth: "700px", marginTop: "10px" }}>
                Our Drowsiness Detection System uses advanced AI and Computer Vision
                techniques to monitor the driver's eye movements in real-time.
                It detects signs of fatigue and alerts the driver instantly, helping
                prevent accidents caused by drowsiness.
            </p>

            {/* Benefits Section */}
            <h2 style={{ marginTop: "20px" }}>Key Benefits</h2>
            <ul>
                <li> Real-time detection of driver fatigue</li>
                <li> Instant alert system to wake up the driver</li>
                <li> AI-powered accuracy using CNN model</li>
                <li> Helps reduce road accidents</li>
                <li> Continuous monitoring without interruption</li>
                <li> Easy to use and automated system</li>
            </ul>

            {/* Action Button */}
            <button 
                style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "green", color: "white" }}
                onClick={handleSubscribe}
            >
             Subscribe Now
            </button>

            {/* Logout */}
            <br /><br />
            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;