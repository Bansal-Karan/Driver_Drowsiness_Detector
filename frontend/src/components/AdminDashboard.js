import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [data, setData] = useState(null);

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

    if (!data) return <h2>Loading...</h2>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>

            <h2>Total Users: {data.total_users}</h2>
            <h2>Total Subscribers: {data.total_subscribers}</h2>

            <h3>Subscribers</h3>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>End Date</th>
                        <th>Usage</th>
                    </tr>
                </thead>

                <tbody>
                    {data.subscribers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.subscription_end
                                    ? new Date(user.subscription_end).toLocaleDateString()
                                    : "N/A"}
                            </td>
                            <td>{user.usage_count || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;