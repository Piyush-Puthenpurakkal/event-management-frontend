import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import AxiosInstance from "../api/AxiosInstance";
import ParticipantsPopup from "../components/ParticipantsPopup";
import "../styles/booking.css";
import "../styles/ParticipantsPopup.css";
import dayjs from "dayjs";
import AuthContext from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

const Booking = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupBookingId, setPopupBookingId] = useState(null);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const popupRef = useRef();

  useEffect(() => {
    console.log("Booking component mounted, current user:", user);
  }, [user]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await AxiosInstance.get("/bookings");
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
      addToast("error", "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getEffectiveStatus = (booking) => {
    if (booking.user.toString() === user._id.toString()) {
      const hostParticipant = booking.participants.find((p) => {
        const pid =
          typeof p.user === "object" && p.user._id
            ? p.user._id.toString()
            : p.user.toString();
        return pid === user._id.toString();
      });
      return hostParticipant ? hostParticipant.status : booking.status;
    } else {
      const participant = booking.participants.find((p) => {
        const pid =
          typeof p.user === "object" && p.user._id
            ? p.user._id.toString()
            : p.user.toString();
        return pid === user._id.toString();
      });
      return participant ? participant.status : "Pending";
    }
  };

  const isUserParticipant = (booking) => {
    return booking.participants.some((p) => {
      const pid =
        typeof p.user === "object" && p.user._id
          ? p.user._id.toString()
          : p.user.toString();
      return pid === user._id.toString();
    });
  };

  const now = dayjs();

  const bookingsToRender = bookings.filter((bk) => {
    const effectiveStatus = getEffectiveStatus(bk);
    if (activeTab === "upcoming") {
      return (
        dayjs(bk.startTime).isAfter(now) &&
        (effectiveStatus === "Pending" || effectiveStatus === "Accepted")
      );
    } else if (activeTab === "pending") {
      return bk.user.toString() !== user._id.toString()
        ? effectiveStatus === "Pending"
        : isUserParticipant(bk) && effectiveStatus === "Pending";
    } else if (activeTab === "canceled") {
      return bk.status === "Canceled" || getEffectiveStatus(bk) === "Rejected";
    } else if (activeTab === "past") {
      return dayjs(bk.startTime).isBefore(now);
    }
    return true;
  });

  const formatDate = (dateStr) => dayjs(dateStr).format("dddd, D MMM");
  const formatTimeRange = (start, end) => {
    const startStr = dayjs(start).format("h:mm A");
    const endStr = dayjs(end).format("h:mm A");
    return `${startStr} - ${endStr}`;
  };

  // Build the appointment text: "You and [Other]" or "You and team X"
  const buildAppointmentText = (bk) => {
    const uniqueIds = Array.from(
      new Set(
        bk.participants.map((p) =>
          typeof p.user === "object" && p.user._id
            ? p.user._id.toString()
            : p.user.toString()
        )
      )
    );
    const totalCount = uniqueIds.length;
    if (totalCount === 1) return "You";
    else if (totalCount === 2) {
      const other = bk.participants.find((p) => {
        const pid =
          typeof p.user === "object" && p.user._id
            ? p.user._id.toString()
            : p.user.toString();
        return pid !== user._id.toString();
      });
      if (!other) return "You and someone";
      const fullName = `${other.user.firstName || ""} ${
        other.user.lastName || ""
      }`.trim();
      return fullName
        ? `You and ${fullName}`
        : `You and ${other.user.email || "someone"}`;
    } else {
      return `You and team ${totalCount - 1}`;
    }
  };

  const handleShowParticipants = (bookingId, participants, booking) => {
    if (popupBookingId === bookingId) {
      setPopupBookingId(null);
      setCurrentParticipants([]);
    } else {
      const hostId = booking.user.toString();
      const hostExists = participants.some((p) => {
        const pid =
          typeof p.user === "object" && p.user._id
            ? p.user._id.toString()
            : p.user.toString();
        return pid === hostId;
      });
      const allParticipants = hostExists
        ? participants
        : [{ user: booking.user, status: booking.status }, ...participants];
      setCurrentParticipants(allParticipants);
      setPopupBookingId(bookingId);
    }
  };

  const handleClosePopup = () => {
    setPopupBookingId(null);
    setCurrentParticipants([]);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClosePopup();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = async (bookingId, newStatus) => {
    try {
      await AxiosInstance.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      addToast("success", `Booking status updated to ${newStatus}.`);
      await fetchBookings();
    } catch (error) {
      console.error(
        "Failed to update booking status:",
        error.response || error
      );
      addToast("error", "Failed to update booking status.");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="booking-page-wrapper">
      <header className="booking-header">
        <h1 className="booking-title">Booking</h1>
        <p className="booking-subtitle">
          See upcoming and past events booked through your event type links.
        </p>
      </header>

      <div className="booking-container">
        <div className="booking-tabs">
          <button
            className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`tab-btn ${activeTab === "canceled" ? "active" : ""}`}
            onClick={() => setActiveTab("canceled")}
          >
            Canceled
          </button>
          <button
            className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
        </div>

        <div className="booking-list">
          {bookingsToRender.length === 0 ? (
            <p className="empty-state">No bookings found in this tab.</p>
          ) : (
            bookingsToRender.map((bk) => {
              const bookingId = bk._id || bk.id;
              const effectiveStatus = getEffectiveStatus(bk);
              const isHost = bk.user.toString() === user._id.toString();
              const isParticipant = isUserParticipant(bk);
              const appointmentText = buildAppointmentText(bk);

              // Deduplicate for participants count
              const uniqueParticipantCount = Array.from(
                new Set(
                  bk.participants.map((p) =>
                    typeof p.user === "object" && p.user._id
                      ? p.user._id.toString()
                      : p.user.toString()
                  )
                )
              ).length;

              return (
                <div key={bookingId} className="booking-row">
                  <div className="booking-left-col">
                    <p className="booking-date">{formatDate(bk.startTime)}</p>
                    <p className="booking-time">
                      {formatTimeRange(bk.startTime, bk.endTime)}
                    </p>
                  </div>
                  <div className="booking-center-col">
                    <h3 className="booking-meeting-title">{bk.title}</h3>
                    <p className="booking-appointment-text">
                      {appointmentText}
                    </p>
                  </div>
                  <div className="booking-right-col">
                    {activeTab === "pending" &&
                    effectiveStatus === "Pending" &&
                    (!isHost || (isHost && isParticipant)) ? (
                      <div className="action-buttons">
                        <button
                          className="reject-btn"
                          onClick={() => handleAction(bookingId, "Rejected")}
                        >
                          <img
                            src={require("../assets/Booking/reject.png")}
                            alt="Reject"
                            className="action-icon"
                          />
                          Reject
                        </button>
                        <button
                          className="accept-btn"
                          onClick={() => handleAction(bookingId, "Accepted")}
                        >
                          <img
                            src={require("../assets/Booking/accept.png")}
                            alt="Accept"
                            className="action-icon"
                          />
                          Accept
                        </button>
                      </div>
                    ) : (
                      (!isHost || (isHost && isParticipant)) && (
                        <span
                          className={`booking-status status-${
                            effectiveStatus ? effectiveStatus.toLowerCase() : ""
                          }`}
                        >
                          {effectiveStatus}
                        </span>
                      )
                    )}
                    <div className="participants-anchor">
                      <button
                        className="participants-btn"
                        onClick={() =>
                          handleShowParticipants(bookingId, bk.participants, bk)
                        }
                      >
                        <img
                          src={require("../assets/Booking/people.png")}
                          alt="people"
                          className="people-icon"
                        />
                        {uniqueParticipantCount} people
                      </button>
                      {popupBookingId === bookingId && (
                        <div ref={popupRef}>
                          <ParticipantsPopup
                            participants={currentParticipants}
                            bookingId={bookingId}
                            onClose={handleClosePopup}
                            refreshBookings={fetchBookings}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
