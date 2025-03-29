import React, { useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import Toast from "../Toast";
import "../styles/Toast.css";

const ToastList = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  if (!toasts.length) return null;

  return (
    <div className="toast-list">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastList;
