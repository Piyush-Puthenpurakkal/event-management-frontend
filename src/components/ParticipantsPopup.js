import React, { useContext } from "react";
import AxiosInstance from "../api/AxiosInstance";
import AuthContext from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import "../styles/ParticipantsPopup.css";

const ParticipantsPopup = ({
  participants,
  bookingId,
  onClose,
  refreshBookings,
}) => {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const uniqueParticipants = Array.from(
    new Map(
      participants.map((p) => {
        const key =
          typeof p.user === "object" && p.user._id
            ? p.user._id.toString()
            : p.user.toString();
        return [key, p];
      })
    ).values()
  );

  const handleCheckboxChange = async (e, participant) => {
    const newStatus = e.target.checked ? "Accepted" : "Rejected";
    try {
      await AxiosInstance.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      addToast("success", `Participant status updated to ${newStatus}.`);
      refreshBookings();
    } catch (err) {
      console.error(
        "Failed to update participant status:",
        err.response || err
      );
      addToast("error", "Failed to update participant status.");
    }
  };

  return (
    <div className="participants-popup" onClick={(e) => e.stopPropagation()}>
      <div className="popup-header">
        <span className="popup-title">
          Participants ({uniqueParticipants.length})
        </span>
        <button className="popup-close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      <ul className="participants-list">
        {uniqueParticipants.map((p, idx) => {
          const firstName = p.user.firstName || "";
          const lastName = p.user.lastName || "";
          const participantId =
            typeof p.user === "object" && p.user._id
              ? p.user._id.toString()
              : p.user.toString();
          const isCurrentUser = participantId === user._id.toString();
          const accepted = p.status === "Accepted";
          return (
            <li key={idx} className="participant-item">
              <img
                src={p.user.avatar}
                alt={`${firstName} ${lastName}`}
                className="participant-avatar"
              />
              <span className="participant-name">
                {firstName} {lastName}
              </span>
              <input
                type="checkbox"
                className="participant-checkbox"
                checked={accepted}
                disabled={!isCurrentUser}
                onChange={(e) => {
                  if (isCurrentUser) handleCheckboxChange(e, p);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ParticipantsPopup;
