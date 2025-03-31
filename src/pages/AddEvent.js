import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import AxiosInstance from "../api/AxiosInstance";
import { ToastContext } from "../context/ToastContext";
import "../styles/addEvent.css";

import userAvatar from "../assets/userAvatar.png";
import editIcon from "../assets/AddEvent/edit-icon.png";
import conflictIcon from "../assets/events/conflict.png";

const AddEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useContext(ToastContext);

  const editingEvent = location.state?.event;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topic, setTopic] = useState(editingEvent ? editingEvent.title : "");
  const [password, setPassword] = useState(
    editingEvent ? editingEvent.password : ""
  );
  const [hostName, setHostName] = useState(
    editingEvent ? editingEvent.hostName : "Your Name"
  );
  const [description, setDescription] = useState(
    editingEvent ? editingEvent.description : ""
  );
  const [date, setDate] = useState(
    editingEvent ? dayjs(editingEvent.startTime).format("YYYY-MM-DD") : ""
  );
  const [time, setTime] = useState(
    editingEvent ? dayjs(editingEvent.startTime).format("HH:mm") : ""
  );
  const [duration, setDuration] = useState("1 hour");
  const [bannerName, setBannerName] = useState(
    editingEvent ? editingEvent.bannerName : "Meeting Title"
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [bannerColor, setBannerColor] = useState(
    editingEvent ? editingEvent.bannerColor : "#000000"
  );
  const [link, setLink] = useState(
    editingEvent ? editingEvent.meetingLink : ""
  );

  // Update: Use email IDs instead of MongoDB IDs from participants
  const [inviteeIds, setInviteeIds] = useState(() => {
    if (editingEvent && Array.isArray(editingEvent.participants)) {
      return editingEvent.participants
        .map((p) =>
          typeof p.user === "object" && p.user.email
            ? p.user.email
            : p.user.toString()
        )
        .join(", ");
    }
    return "";
  });

  const [conflictError, setConflictError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!topic || !date || !time) {
      addToast("error", "Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const startTimeString = `${date}T${time}`;
    const startTime = dayjs(startTimeString).toDate();

    let durationMinutes = 60;
    if (duration === "15 minutes") durationMinutes = 15;
    else if (duration === "30 minutes") durationMinutes = 30;
    else if (duration === "2 hours") durationMinutes = 120;

    const endTime = dayjs(startTime).add(durationMinutes, "minute").toDate();

    // Convert comma separated invitee emails into an array of strings
    const inviteeArray = inviteeIds
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    const eventData = {
      title: topic,
      description,
      hostName,
      password,
      startTime,
      endTime,
      bannerName,
      bannerColor,
      meetingLink: link,
      inviteeIds: inviteeArray,
    };

    try {
      if (editingEvent) {
        await AxiosInstance.put(`/events/${editingEvent._id}`, eventData);
      } else {
        await AxiosInstance.post("/events", eventData);
      }
      setConflictError(null);
      navigate("/events", {
        state: {
          toast: {
            type: "success",
            message: editingEvent
              ? "Event updated successfully!"
              : "Event created successfully!",
          },
        },
      });
    } catch (error) {
      console.error("Error saving event:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Time conflict detected"
      ) {
        setConflictError("Conflict of timing");
      } else {
        addToast("error", "Failed to save event. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    addToast("error", "Event creation cancelled.");
    navigate("/events");
  };

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (e) => {
    setBannerName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
  };

  return (
    <form className="add-event-container" onSubmit={handleSubmit}>
      <h1 className="page-title">
        {editingEvent ? "Edit Event" : "Add Event"}
      </h1>

      {conflictError && (
        <div className="conflict-placeholder">
          <img src={conflictIcon} alt="Conflict" className="conflict-icon" />
          <span>{conflictError}</span>
        </div>
      )}

      <div className="event-form-card">
        <div className="form-row">
          <label>
            Event Topic <span>*</span>
          </label>
          <input
            type="text"
            placeholder="Set a concise topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Password (optional)</label>
          <input
            type="password"
            placeholder="Optional password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Host name</label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            placeholder="Enter description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-row half-row">
          <div className="date-time">
            <label className="date-time-label">Date and time</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="set-duration">
            <label>Set duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="banner-card">
        <h2>{editingEvent ? "Edit Event" : "Add Event"}</h2>
        <div
          className="banner-rectangle"
          style={{ backgroundColor: bannerColor }}
        >
          <img src={userAvatar} alt="User Avatar" className="banner-avatar" />
          {isEditingName ? (
            <input
              type="text"
              className="banner-name-input"
              value={bannerName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              autoFocus
            />
          ) : (
            <div className="banner-name-row">
              <span className="banner-name">{bannerName}</span>
              <img
                src={editIcon}
                alt="Edit"
                className="banner-edit-icon"
                onClick={handleEditNameClick}
              />
            </div>
          )}
        </div>
        <div className="banner-color-section">
          <label className="color-label">Custom Background Color</label>
          <div className="color-picker-row">
            <div className="color-picker">
              <div
                className="circle orange-circle"
                onClick={() => setBannerColor("#ff6b35")}
              ></div>
              <div
                className="circle black-circle"
                onClick={() => setBannerColor("#000000")}
              ></div>
              <div
                className="circle white-circle"
                onClick={() => setBannerColor("#ffffff")}
              ></div>
            </div>

            <div className="color-input-wrap">
              <div
                className="color-preview"
                style={{ backgroundColor: bannerColor }}
              ></div>
              <input
                type="text"
                value={bannerColor}
                onChange={(e) => setBannerColor(e.target.value)}
                className="color-hex-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="link-email-card">
        <h2>Meeting Link & Invite Participants</h2>
        <div className="link-email-section">
          <label>Meeting Link</label>
          <input
            type="text"
            placeholder="Enter meeting URL"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <label>Invite Participants (Email IDs)</label>
          <input
            type="text"
            placeholder="Enter email IDs separated by commas"
            value={inviteeIds}
            onChange={(e) => setInviteeIds(e.target.value)}
          />
        </div>
      </div>

      <div className="page-actions">
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="save-btn">
          Save
        </button>
      </div>
    </form>
  );
};

export default AddEvent;
