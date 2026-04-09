import React, { useState } from "react";
import API from "../api";
import {Link, useNavigate} from "react-router-dom"

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/register", form);
      alert(res.data.message);
      navigate("/")
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <p>
        Existing User?{" "}
        <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Register;