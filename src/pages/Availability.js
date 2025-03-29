import React, { useState, useEffect, useRef, useContext } from "react";
import dayjs from "dayjs";
import AvailabilityListView from "../components/AvailabilityListView";
import AvailabilityCalendarView from "../components/AvailabilityCalendarView";
import AxiosInstance from "../api/AxiosInstance";
import { ToastContext } from "../context/ToastContext";
import "../styles/availability.css";

import availabilityIcon from "../assets/Availability/availability-icon.png";
import calendarIcon from "../assets/Availability/calendar-icon.png";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayIndexFromName(dayName) {
  return dayNames.indexOf(dayName);
}

export default function Availability() {
  const [activeTab, setActiveTab] = useState("availability");
  const [activity, setActivity] = useState("Event type");
  const [timeZone, setTimeZone] = useState("Indian Time Standard");
  const [selectedView, setSelectedView] = useState("Week");

  const [days, setDays] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mergedRef = useRef(false);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const response = await AxiosInstance.get("/availability");
        setDays(response.data.days || []);
      } catch (err) {
        console.error("Error fetching availability:", err);
        setError("Failed to load availability.");
        addToast("error", "Failed to load availability.");
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [addToast]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await AxiosInstance.get("/events");
        setEvents(response.data || []);
        addToast("success", "Events loaded successfully!");
      } catch (err) {
        console.error("Error fetching events:", err);
        addToast("error", "Failed to load events.");
      }
    }
    fetchEvents();
  }, [addToast]);

  useEffect(() => {
    if (!days.length || !events.length) return;
    if (mergedRef.current) return;

    const mergedDays = mergeEventIntervalsIntoDays(days, events);
    setDays(mergedDays);
    mergedRef.current = true;
  }, [days, events]);

  function mergeEventIntervalsIntoDays(originalDays, allEvents) {
    const newDays = JSON.parse(JSON.stringify(originalDays));
    newDays.forEach((dayObj) => {
      const dayIndex = getDayIndexFromName(dayObj.day);
      if (dayIndex < 0) return;
      const dayEvents = allEvents.filter((ev) => {
        const evDayIndex = dayjs(ev.startTime).day();
        return evDayIndex === dayIndex;
      });
      dayEvents.forEach((ev) => {
        const startStr = dayjs(ev.startTime).format("HH:mm");
        const endStr = dayjs(ev.endTime).format("HH:mm");
        const alreadyExists = dayObj.intervals.some(
          (itv) => itv.start === startStr && itv.end === endStr
        );
        if (!alreadyExists) {
          dayObj.intervals.push({ start: startStr, end: endStr });
        }
      });
    });
    return newDays;
  }

  async function updateAvailability(updatedDays) {
    try {
      const response = await AxiosInstance.put("/availability", {
        days: updatedDays,
      });
      setDays(response.data.days);
      addToast("success", "Availability updated successfully!");
    } catch (err) {
      console.error("Error updating availability:", err);
      setError("Failed to update availability.");
      addToast("error", "Failed to update availability.");
    }
  }

  function handleToggleSwitch(e) {
    setActiveTab(e.target.checked ? "calendar" : "availability");
  }

  function handleUnavailableChange(dayIndex) {
    const updated = days.map((d, i) =>
      i === dayIndex ? { ...d, unavailable: !d.unavailable } : d
    );
    setDays(updated);
    updateAvailability(updated);
  }

  function handleAddInterval(dayIndex) {
    const updated = days.map((d, i) => {
      if (i === dayIndex) {
        return { ...d, intervals: [...d.intervals, { start: "", end: "" }] };
      }
      return d;
    });
    setDays(updated);
    updateAvailability(updated);
    addToast("success", "Interval added!");
  }

  function handleRemoveInterval(dayIndex, intervalIndex) {
    const updated = days.map((d, i) => {
      if (i === dayIndex) {
        const newIntervals = d.intervals.filter(
          (_, idx) => idx !== intervalIndex
        );
        return { ...d, intervals: newIntervals };
      }
      return d;
    });
    setDays(updated);
    updateAvailability(updated);
    addToast("success", "Interval removed!");
  }

  function handleCopyInterval(dayIndex) {
    addToast("success", "Interval copied!");
  }

  function handleIntervalChange(dayIndex, intervalIndex, field, value) {
    const updated = days.map((d, i) => {
      if (i === dayIndex) {
        const newIntervals = d.intervals.map((interval, idx) =>
          idx === intervalIndex ? { ...interval, [field]: value } : interval
        );
        return { ...d, intervals: newIntervals };
      }
      return d;
    });
    setDays(updated);
    updateAvailability(updated);
  }

  // Filter events based on the Activity select:
  // - "Event type": show all events.
  // - "1-on-1": only show events with exactly 2 unique participants.
  // - "Group meeting": only show events with more than 2 unique participants.
  const filteredEvents = events.filter((ev) => {
    if (activity === "Event type") {
      return true;
    }
    const participants = ev.participants || [];
    const uniqueIds = Array.from(
      new Set(
        participants.map((p) =>
          typeof p.user === "object" && p.user._id
            ? p.user._id.toString()
            : p.user.toString()
        )
      )
    );
    if (activity === "1-on-1") {
      return uniqueIds.length === 2;
    } else if (activity === "Group meeting") {
      return uniqueIds.length > 2;
    }
    return true;
  });

  if (loading) return <p>Loading availability...</p>;
  if (error) return <p>{error}</p>;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const currentDate = dayjs();
  const startOfWeek = currentDate.startOf("week");
  const dynamicDayLabels = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, "day").format("ddd D")
  );

  return (
    <div className="availability-page-container">
      <div className="availability-header">
        <h1 className="availability-title">Availability</h1>
        <p className="availability-subtext">
          Configure times when you are available for bookings
        </p>
      </div>

      {/* The switch row is now kept outside the white box */}
      <div className="switch-row" style={{ marginTop: "1rem" }}>
        <input
          type="checkbox"
          id="toggleView"
          className="toggleCheckbox"
          checked={activeTab === "calendar"}
          onChange={handleToggleSwitch}
        />
        <label htmlFor="toggleView" className="toggleContainer">
          <div className="toggleOption toggleAvailability">
            <img
              src={availabilityIcon}
              alt="Availability"
              style={{ width: "16px", marginRight: "6px" }}
            />
            Availability
          </div>
          <div className="toggleOption toggleCalendar">
            <img
              src={calendarIcon}
              alt="Calendar View"
              style={{ width: "16px", marginRight: "6px" }}
            />
            Calendar View
          </div>
        </label>
      </div>

      {/* The white box now contains the filter selects */}
      <div className="availability-white-box">
        <div className="availability-top-row">
          <div className="left-filters">
            <div className="filter-block">
              <label className="filter-label">Activity</label>
              <select
                className="filter-select"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                <option>Event type</option>
                <option>Group meeting</option>
                <option>1-on-1</option>
              </select>
            </div>
            <div className="filter-block">
              <label className="filter-label">Time Zone</label>
              <select
                className="filter-select"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
              >
                <option>Indian Time Standard</option>
                <option>EST GMT-5</option>
                <option>PST GMT-8</option>
              </select>
            </div>
          </div>
        </div>

        {/* Depending on activeTab, show list view or calendar view */}
        {activeTab === "availability" ? (
          <AvailabilityListView
            days={days}
            handleUnavailableChange={handleUnavailableChange}
            handleAddInterval={handleAddInterval}
            handleRemoveInterval={handleRemoveInterval}
            handleCopyInterval={handleCopyInterval}
            handleIntervalChange={handleIntervalChange}
          />
        ) : (
          <AvailabilityCalendarView
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            dayLabels={dynamicDayLabels}
            hours={hours}
            sampleEvents={filteredEvents}
            currentDate={currentDate}
          />
        )}
      </div>
    </div>
  );
}
