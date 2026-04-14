import React, { useState } from 'react'
import API from "../api";
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = async (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e)=> {
    e.preventDefault();
    try{
        const res = await API.post('/admin', form)

        if(res.data.message === "Admin login successful"){
            localStorage.setItem("adminEmail", form.email)

            navigate('/admin-dashboard')
            alert("admin login successful")
        }

    } catch (err) {
        alert("Invalid credentials");
    }
}

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default AdminLogin
