import React from "react";
import successIconImg from "./assets/toast-messages/tick.png";
import errorIconImg from "./assets/toast-messages/danger.png";
import "./styles/Toast.css";

const Toast = ({ type, message, onClose }) => {
  const successIcon = (
    <img
      src={successIconImg}
      alt="Success"
      style={{ width: "20px", height: "20px" }}
    />
  );
  const errorIcon = (
    <img
      src={errorIconImg}
      alt="Error"
      style={{ width: "20px", height: "20px" }}
    />
  );

  const icon = type === "success" ? successIcon : errorIcon;

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-icon">{icon}</div>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;
