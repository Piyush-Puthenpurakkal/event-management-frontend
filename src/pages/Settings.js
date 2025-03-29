import React, { useState, useEffect, useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import API from "../api/AxiosInstance";
import "../styles/settings.css";

const Settings = () => {
  const { addToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => {
        const { firstName, lastName, email } = res.data;
        setFormData((prev) => ({
          ...prev,
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || "",
        }));
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        addToast("error", "Failed to load profile");
      });
  }, [addToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate password strength:
  // At least 8 characters, one uppercase, one lowercase, one digit, and one special character.
  const isStrongPassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      addToast("error", "Passwords do not match");
      return;
    }

    if (password && !isStrongPassword(password)) {
      addToast(
        "error",
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const updateData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };

      if (password) {
        updateData.password = password;
      }

      await API.put("/users/profile", updateData);
      addToast("success", "Profile saved successfully!");
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast("error", "Failed to update profile");
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Profile</h1>
      <p className="settings-subtitle">Manage settings for your profile</p>

      <div className="settings-card">
        <h2 className="settings-card-title">Edit Profile</h2>
        <form onSubmit={handleSave} className="settings-form">
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
          />

          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password (optional)"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="settings-save-btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
