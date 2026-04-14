import React, { useEffect, useState } from "react";
import { FaUsers, FaCrown, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        const email = localStorage.getItem("adminEmail");

        fetch("http://127.0.0.1:5000/admin-dashboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert("Unauthorized");
                    return;
                }
                setData(data);
            });
    }, []);

    useEffect(() => {
        const email = localStorage.getItem("adminEmail");

        if (!email) {
            window.location.href = "/admin-login";
        }
    }, []);

    useEffect(() => {
        const name = localStorage.getItem("adminName");
        setAdminName(name || "");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminName");
        window.location.href = "/admin-login";
    };

    if (!data) return <h2>Loading...</h2>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500 p-2 rounded-full">
                                <FaUsers className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                                {adminName && <p className="text-sm text-gray-600">Welcome, {adminName}</p>}
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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500 p-3 rounded-full">
                                <FaUsers className="text-white text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Total Users</h2>
                                <p className="text-3xl font-bold text-blue-600">{data.total_users}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-500 p-3 rounded-full">
                                <FaCrown className="text-white text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Subscribers</h2>
                                <p className="text-3xl font-bold text-green-600">{data.total_subscribers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscribers Table */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Subscriber Details</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">End Date</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Usage</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.subscribers.map((user, index) => (
                                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition duration-200">
                                        <td className="p-4">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            {user.subscription_end
                                                ? new Date(user.subscription_end).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td className="p-4">{user.usage || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;