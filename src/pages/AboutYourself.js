import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AxiosInstance from "../api/AxiosInstance";
import "../styles/auth.css";

// Category icons
import salesIcon from "../assets/auth/sales.png";
import financeIcon from "../assets/auth/finance.png";
import consultingIcon from "../assets/auth/consulting.png";
import techIcon from "../assets/auth/tech.png";
import educationIcon from "../assets/auth/education.png";
import governmentIcon from "../assets/auth/government.png";
import recruitingIcon from "../assets/auth/recruiting.png";
import marketingIcon from "../assets/auth/marketing.png";

const AboutYourself = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local state for username and selected category, plus error/loading state
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "Sales", label: "Sales", icon: salesIcon },
    { value: "Finance", label: "Finance", icon: financeIcon },
    { value: "Consulting", label: "Consulting", icon: consultingIcon },
    { value: "Tech", label: "Tech", icon: techIcon },
    { value: "Education", label: "Education", icon: educationIcon },
    {
      value: "Government & Politics",
      label: "Government & Politics",
      icon: governmentIcon,
    },
    { value: "Recruiting", label: "Recruiting", icon: recruitingIcon },
    { value: "Marketing", label: "Marketing", icon: marketingIcon },
  ];

  const handleCategoryClick = (catValue) => {
    setSelectedCategory(catValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !selectedCategory) {
      setError("Please enter a username and select a category.");
      return;
    }
    setLoading(true);
    try {
      const updateData = {
        username: username.trim(),
        category: selectedCategory,
      };
      // Update the user profile on the backend
      const res = await AxiosInstance.put("/users/profile", updateData);
      // Update the AuthContext with the new user data
      login(res.data);
      // Redirect to dashboard after profile update
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT COLUMN */}
      <div className="auth-left">
        <img src="/logo.png" alt="CNNCT Logo" className="auth-logo" />
        <div className="auth-box">
          <h2>Your Preferences</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tell us your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <p>Select one category that best describes your CNNCT:</p>
            <div className="two-col-container">
              <div className="col">
                {categories.slice(0, 4).map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`category-choice ${
                      selectedCategory === cat.value ? "selected" : ""
                    }`}
                    onClick={() => handleCategoryClick(cat.value)}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      className="category-icon"
                    />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
              <div className="col">
                {categories.slice(4).map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`category-choice ${
                      selectedCategory === cat.value ? "selected" : ""
                    }`}
                    onClick={() => handleCategoryClick(cat.value)}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      className="category-icon"
                    />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="auth-right">
        <img
          src="/illustration-image.png"
          alt="Preferences Illustration"
          className="auth-illustration"
        />
      </div>
    </div>
  );
};

export default AboutYourself;
