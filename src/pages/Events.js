import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import AxiosInstance from "../api/AxiosInstance";
import { ToastContext } from "../context/ToastContext";
import AuthContext from "../context/AuthContext";
import "../styles/events.css";

import pencilIcon from "../assets/events/edit.png";
import copyIcon from "../assets/events/copy.png";
import deleteIcon from "../assets/events/delete.png";
import conflictIcon from "../assets/events/conflict.png";

const Events = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conflictError, setConflictError] = useState(null);

  useEffect(() => {
    if (location.state?.toast) {
      const { type, message } = location.state.toast;
      addToast(type, message);
      navigate(location.pathname, { replace: true, state: {} });
    }
    const fetchEvents = async () => {
      try {
        const response = await AxiosInstance.get("/events");
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        addToast("error", "Failed to load events.");
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [addToast, location, navigate]);

  const formatEventDate = (startTime) => dayjs(startTime).format("dddd, D MMM");
  const formatEventTimeRange = (startTime, endTime) => {
    const start = dayjs(startTime).format("h:mm A");
    const end = dayjs(endTime).format("h:mm A");
    return `${start} - ${end}`;
  };

  const handleEdit = (eventData) => {
    navigate("/add-event", { state: { event: eventData } });
  };

  const handleCopy = (eventId) => {
    addToast("success", "Copied to clipboard!");
  };

  const handleDelete = async (eventId) => {
    try {
      await AxiosInstance.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((ev) => (ev.id || ev._id) !== eventId));
      addToast("success", "Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Time conflict detected"
      ) {
        setConflictError("Conflict of timing");
      } else {
        addToast("error", "Failed to delete event.");
      }
    }
  };

  const handleToggleActive = (eventId) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if ((ev.id || ev._id) === eventId) {
          const newActive = !ev.isActive;
          addToast(
            "success",
            `Event ${newActive ? "activated" : "deactivated"}.`
          );
          return { ...ev, isActive: newActive };
        }
        return ev;
      })
    );
  };

  const handleAddEvent = () => {
    navigate("/add-event");
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-page">
      {conflictError && (
        <div className="conflict-placeholder">
          <img src={conflictIcon} alt="Conflict" className="conflict-icon" />
          <span>{conflictError}</span>
        </div>
      )}

      <div className="events-header-row">
        <div>
          <h1 className="events-page-title">Event Types</h1>
          <p className="events-page-subtitle">
            Create events to share for people to book on your calendar.
          </p>
        </div>
        <button className="add-new-event-btn" onClick={handleAddEvent}>
          + Add New Event
        </button>
      </div>

      <div className="events-card-row">
        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          events.map((ev) => {
            const eventId = ev.id || ev._id;
            const dateLabel = formatEventDate(ev.startTime);
            const timeLabel = formatEventTimeRange(ev.startTime, ev.endTime);
            const isHost = ev.user.toString() === user._id.toString();
            const uniqueMembers = Array.from(
              new Set(
                ev.participants.map((p) =>
                  typeof p.user === "object" && p.user._id
                    ? p.user._id.toString()
                    : p.user.toString()
                )
              )
            );
            const totalMembers = uniqueMembers.length;
            const eventColor =
              totalMembers === 2 ? "#000000" : ev.color || "#007bff";

            return (
              <div className="event-item" key={eventId}>
                <div
                  className="event-color-bar"
                  style={{ backgroundColor: eventColor }}
                ></div>
                <div className="event-header-row">
                  <h2 className="event-title">{ev.title}</h2>
                  {isHost && (
                    <img
                      src={pencilIcon}
                      alt="Edit"
                      className="icon-btn"
                      onClick={() => handleEdit(ev)}
                    />
                  )}
                </div>
                <p className="event-date">{dateLabel}</p>
                <p className="event-time">{timeLabel}</p>
                <p className="event-type">
                  {ev.type || (totalMembers === 2 ? "Appointment" : "Meeting")}
                </p>
                <div className="divider-line"></div>
                <div className="event-bottom-row">
                  <div className="right-icons">
                    <div className="toggle-container">
                      <input
                        type="checkbox"
                        id={`switch-${eventId}`}
                        checked={!!ev.isActive}
                        onChange={() => handleToggleActive(eventId)}
                      />
                      <label
                        htmlFor={`switch-${eventId}`}
                        className="switch-label"
                      >
                        Toggle
                      </label>
                    </div>
                    <img
                      src={copyIcon}
                      alt="Copy"
                      className="icon-btn"
                      onClick={() => handleCopy(eventId)}
                    />
                    {isHost && (
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="icon-btn"
                        onClick={() => handleDelete(eventId)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Events;
