import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaEye, FaBell, FaBrain, FaShieldAlt, FaClock, FaUser, FaSignOutAlt, FaCreditCard, FaPlay, FaSpinner } from "react-icons/fa";

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        if (!token) {
            navigate("/");
        } else {
            setUserName(name || "");
            checkAndUpdateExpiredSubscription();
        }
    }, [navigate]);

    const checkAndUpdateExpiredSubscription = async () => {
        const email = localStorage.getItem("email");
        const subscriptionEnd = localStorage.getItem("subscriptionEnd");

        if (!email || !subscriptionEnd) {
            return;
        }

        const endDate = new Date(subscriptionEnd);
        const currentDate = new Date();

        // If subscription has expired, notify backend to update
        if (currentDate > endDate) {
            try {
                await fetch("http://127.0.0.1:5000/update-expired-subscription", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });
            } catch (err) {
                console.error("Error updating expired subscription:", err);
            }
        }
    };

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

    const stopCamera = async () => {
        await fetch("http://127.0.0.1:5000/stop-drowsiness", {
            method: "POST",
        });
        setShowCamera(false);
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
            setLoading(true);
            await fetch("http://127.0.0.1:5000/start-drowsiness", {
                method: "POST",
            });
            setLoading(false);
            setShowCamera(true);
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
                                disabled={loading}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Starting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlay />
                                        <span>Use Detection Service</span>
                                    </>
                                )}
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

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl max-w-4xl w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Drowsiness Detection Active</h3>
                        <img
                            src="http://127.0.0.1:5000/video_feed"
                            alt="Drowsiness Detection Feed"
                            className="w-full h-auto rounded-lg border-2 border-gray-300"
                            style={{ maxHeight: '70vh' }}
                        />
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={stopCamera}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-300 ease-in-out"
                            >
                                Stop Detection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;