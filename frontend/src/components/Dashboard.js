import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaEye, FaBell, FaBrain, FaShieldAlt, FaClock, FaUser, FaSignOutAlt, FaCreditCard, FaPlay } from "react-icons/fa";

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        if (!token) {
            navigate("/");
        } else {
            setUserName(name || "");
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


    const benefits = [
        { icon: <FaEye className="text-blue-500 text-2xl" />, text: "Real-time detection of driver fatigue" },
        { icon: <FaBell className="text-yellow-500 text-2xl" />, text: "Instant alert system to wake up the driver" },
        { icon: <FaBrain className="text-purple-500 text-2xl" />, text: "AI-powered accuracy using CNN model" },
        { icon: <FaShieldAlt className="text-green-500 text-2xl" />, text: "Helps reduce road accidents" },
        { icon: <FaClock className="text-indigo-500 text-2xl" />, text: "Continuous monitoring without interruption" },
        { icon: <FaUser className="text-pink-500 text-2xl" />, text: "Easy to use and automated system" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500 p-2 rounded-full">
                                <FaEye className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Driver Drowsiness System</h1>
                                {userName && <p className="text-sm text-gray-600">Welcome, {userName}</p>}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Advanced Drowsiness Detection
                        </h2>
                        <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                            Our cutting-edge system uses AI and computer vision to monitor driver eye movements in real-time,
                            detecting fatigue and preventing accidents before they happen.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleSubscribe}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                            >
                                <FaCreditCard />
                                <span>Subscribe Now</span>
                            </button>
                            <button
                                onClick={handleUseService}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                            >
                                <FaPlay />
                                <span>Use Detection Service</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        Key Benefits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                                <div className="flex items-center space-x-4">
                                    {benefit.icon}
                                    <p className="text-gray-700 font-medium">{benefit.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;