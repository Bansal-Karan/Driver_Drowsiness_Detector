import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const activateSubscription = async () => {
        const email = localStorage.getItem("email");

        if (!email) {
            alert("Unable to activate subscription: email not found. Please log in again.");
            return;
        }

        await fetch("http://127.0.0.1:5000/payment-success", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        alert("Subscription Activated!");
    };

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get("success");

        if (success === "true") {
            activateSubscription();
        }
    }, [location]);

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

    const handleUseService = async () => {
        const email = localStorage.getItem("email");

        const res = await fetch("http://127.0.0.1:5000/check-subscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.access) {
        await fetch("http://127.0.0.1:5000/start-drowsiness", {
            method: "POST",
        });

        alert("Drowsiness Detection Started!");
    } else {
        alert("Please subscribe to use this service");
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
            
            {/* Use Service Button */}
            <button onClick={handleUseService}>
                Use Drowsiness Detection
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