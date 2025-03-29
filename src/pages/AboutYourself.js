import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/auth.css";

import logo from "../assets/logo.png";
import illustrationImage from "../assets/illustration-image.png";

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
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      username: username.trim(),
      category: selectedCategory,
    };
    login(updatedUser);
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="CNNCT Logo" className="auth-logo" />
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

            <button type="submit">Continue</button>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <img
          src={illustrationImage}
          alt="Preferences Illustration"
          className="auth-illustration"
        />
      </div>
    </div>
  );
};

export default AboutYourself;
