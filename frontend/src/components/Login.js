import React, { useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);
      console.log(res.data.message);

      // store token and email so payment-success can update the user subscription
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", form.email);
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register here</Link>
      </p>
      <p>
        Are you an admin?{" "}
        <Link to="/admin-login">Login here</Link>
      </p>
    </div>
  );
}

export default Login;