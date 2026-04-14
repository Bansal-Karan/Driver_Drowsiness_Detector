import React, { useState } from 'react'
import API from "../api";
import { useNavigate, Link } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";

const AdminLogin = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(""); // Clear error on input change
    };

    const handleSubmit = async (e)=> {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const res = await API.post('/admin', form)

            if(res.data.message === "Admin login successful"){
                localStorage.setItem("adminEmail", res.data.email)
                localStorage.setItem("adminName", res.data.name)

                navigate('/admin-dashboard')
            } else {
                setError("Invalid admin credentials");
            }

        } catch (err) {
            setError("Invalid admin credentials. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Access</h2>
          <p className="text-gray-600 text-sm">Secure administrative login</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="email"
                type="email"
                placeholder="Enter admin email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Authenticating...
              </div>
            ) : (
              "Admin Login"
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Not an admin?{" "}
            <Link
              to="/"
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
            >
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
