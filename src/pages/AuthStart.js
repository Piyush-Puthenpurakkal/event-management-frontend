import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const AuthStart = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-box">
          <div className="logo">
            <h2>My Event App</h2>
          </div>
          <h2>Welcome to Event Management</h2>
          <p>Choose how you want to sign in or sign up.</p>

          <button className="google-btn">Continue with Google</button>

          <Link to="/login" className="auth-btn">
            Continue with Email (Login)
          </Link>
          <Link to="/signup" className="auth-btn">
            Create an Account (Signup)
          </Link>
        </div>
      </div>

      <div className="auth-right">
        <img
          src="https://via.placeholder.com/400x400"
          alt="Auth Illustration"
          className="illustration-image"
        />
      </div>
    </div>
  );
};

export default AuthStart;
