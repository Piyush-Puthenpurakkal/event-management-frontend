import React, { useState, useContext } from "react";
import searchIcon from "../assets/Availability/search.png";
import dayjs from "dayjs";
import { ToastContext } from "../context/ToastContext";

const AvailabilityCalendarView = ({
  selectedView,
  setSelectedView,
  dayLabels,
  hours,
  sampleEvents,
  currentDate = dayjs(),
}) => {
  const { addToast } = useContext(ToastContext);
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [popupDate, setPopupDate] = useState(null);
  const [popupEvents, setPopupEvents] = useState([]);

  const handleClosePopup = () => {
    setShowDayPopup(false);
    setPopupDate(null);
    setPopupEvents([]);
    addToast("info", "Popup closed");
  };

  const handleDayClick = (dayObj) => {
    const eventsForDay = sampleEvents.filter((ev) =>
      dayjs(ev.startTime).isSame(dayObj, "day")
    );
    setPopupDate(dayObj);
    setPopupEvents(eventsForDay);
    setShowDayPopup(true);
    if (eventsForDay.length === 0) {
      addToast("info", "No events for this day");
    }
  };

  const getCalendarEventStyle = (ev) => {
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
    const isAppointment = uniqueIds.length === 2;

    const hour = dayjs(ev.startTime).hour();
    if (isAppointment) {
      return {
        backgroundColor: "#d3d3d3",
        borderLeft: "4px solid #333",
      };
    } else {
      if (hour < 12) {
        return {
          backgroundColor: "#add8e6",
          borderLeft: "4px solid #00008b",
        };
      } else {
        return {
          backgroundColor: "#e6e6fa",
          borderLeft: "4px solid #800080",
        };
      }
    }
  };

  const renderHeaderControls = () => (
    <div className="center-controls">
      <div className="left-block">
        <button
          className="today-btn"
          onClick={() => setSelectedView(selectedView)}
        >
          Today
        </button>
      </div>
      <div className="middle-block">
        <div className="view-tabs">
          <button
            className={`view-tab ${selectedView === "Day" ? "active" : ""}`}
            onClick={() => setSelectedView("Day")}
          >
            Day
          </button>
          <button
            className={`view-tab ${selectedView === "Week" ? "active" : ""}`}
            onClick={() => setSelectedView("Week")}
          >
            Week
          </button>
          <button
            className={`view-tab ${selectedView === "Month" ? "active" : ""}`}
            onClick={() => setSelectedView("Month")}
          >
            Month
          </button>
          <button
            className={`view-tab ${selectedView === "Year" ? "active" : ""}`}
            onClick={() => setSelectedView("Year")}
          >
            Year
          </button>
        </div>
      </div>
      <div className="right-block">
        <div className="search-input-wrapper">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="calendar-view-card day-view">
      <div className="calendar-header-row common-grid">
        <div className="time-label-left" />
        <div className="day-header-cell">{currentDate.format("ddd D")}</div>
        <div className="time-zone-label">
          EST
          <br />
          GMT-5
        </div>
      </div>
      <div className="calendar-content day-week-scrollable common-grid">
        {/* Left column: time labels */}
        <div className="time-labels-col">
          {hours.map((hour) => (
            <div key={hour} className="time-label">
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </div>
          ))}
        </div>
        {/* Main column */}
        <div className="calendar-day-col">
          {hours.map((hour) => (
            <div key={hour} className="calendar-hour-cell">
              {sampleEvents
                .filter(
                  (ev) =>
                    dayjs(ev.startTime).isSame(currentDate, "day") &&
                    dayjs(ev.startTime).hour() === hour
                )
                .map((ev, idx) => {
                  const duration =
                    dayjs(ev.endTime).diff(dayjs(ev.startTime), "hour") || 1;
                  return (
                    <div
                      key={idx}
                      className="calendar-event-block"
                      style={{
                        height: `${duration * 58}px`,
                        ...getCalendarEventStyle(ev),
                      }}
                    >
                      <div className="event-time">
                        {dayjs(ev.startTime).format("h:mm A")}
                      </div>
                      <div className="event-title-availability">{ev.title}</div>
                      {ev.details && (
                        <div className="event-details">{ev.details}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
        {/* Right column: time labels */}
        <div className="time-labels-col">
          {hours.map((hour) => (
            <div key={hour} className="time-label">
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf("week");
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.add(i, "day")
    );
    return (
      <div className="calendar-view-card week-view">
        <div className="calendar-header-row common-grid-week">
          <div className="time-label-left" />
          {weekDays.map((day, i) => (
            <div key={i} className="day-header-cell">
              {day.format("ddd D")}
            </div>
          ))}
          <div className="time-zone-label">
            EST
            <br />
            GMT-5
          </div>
        </div>
        <div className="calendar-content day-week-scrollable common-grid-week">
          <div className="time-labels-col">
            {hours.map((hour) => (
              <div key={hour} className="time-label">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="calendar-day-col">
              {hours.map((hour) => (
                <div key={hour} className="calendar-hour-cell">
                  {sampleEvents
                    .filter(
                      (ev) =>
                        dayjs(ev.startTime).isSame(day, "day") &&
                        dayjs(ev.startTime).hour() === hour
                    )
                    .map((ev, idx) => {
                      const duration =
                        dayjs(ev.endTime).diff(dayjs(ev.startTime), "hour") ||
                        1;
                      return (
                        <div
                          key={idx}
                          className="calendar-event-block"
                          style={{
                            height: `${duration * 58}px`,
                            ...getCalendarEventStyle(ev),
                          }}
                        >
                          <div className="event-time">
                            {dayjs(ev.startTime).format("h:mm A")}
                          </div>
                          <div className="event-title-availability">
                            {ev.title}
                          </div>
                          {ev.details && (
                            <div className="event-details">{ev.details}</div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          ))}
          <div className="time-labels-col">
            {hours.map((hour) => (
              <div key={hour} className="time-label">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const daysInMonth = endOfMonth.date();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
      startOfMonth.add(i, "day")
    );
    const firstWeekday = startOfMonth.day();

    const weeks = [];
    let currentWeek = [];

    for (let i = 0; i < firstWeekday; i++) {
      currentWeek.push(null);
    }
    daysArray.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    const dayHeaders = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
      <div className="calendar-view-card month-view">
        <div className="month-header">
          <h2>
            {currentDate.format("MMMM")} {currentDate.format("YYYY")}
          </h2>
        </div>
        <table className="month-table">
          <thead>
            <tr className="month-header-row">
              {dayHeaders.map((lbl, idx) => (
                <th key={idx} className="month-cell month-day-label">
                  {lbl}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wIndex) => (
              <tr key={wIndex} className="month-row">
                {week.map((day, dIndex) => {
                  if (!day) {
                    return (
                      <td key={dIndex} className="month-cell empty-cell" />
                    );
                  }
                  const isToday = dayjs(day).isSame(dayjs(), "day");

                  const dayEvents = sampleEvents.filter((ev) =>
                    dayjs(ev.startTime).isSame(day, "day")
                  );
                  return (
                    <td
                      key={dIndex}
                      className={`month-cell ${isToday ? "current-day" : ""}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="month-date">{day.date()}</div>
                      {dayEvents.length > 0 && (
                        <div className="event-indicator" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderYearView = () => {
    const monthsArray = Array.from({ length: 12 }, (_, i) =>
      currentDate.month(i)
    );
    const dayLabelsShort = ["S", "M", "T", "W", "T", "F", "S"];

    return (
      <div className="calendar-view-card year-view">
        <h2 className="year-title">{currentDate.format("YYYY")}</h2>
        <div className="year-grid">
          {monthsArray.map((mDate, mIndex) => {
            const firstDay = mDate.startOf("month");
            const lastDay = mDate.endOf("month");
            const daysInMonth = lastDay.date();
            const monthDays = Array.from({ length: daysInMonth }, (_, i) =>
              firstDay.add(i, "day")
            );

            let miniWeeks = [];
            let thisWeek = new Array(7).fill(null);

            monthDays.forEach((day) => {
              const weekday = day.day();
              thisWeek[weekday] = day;
              if (weekday === 6 || day.date() === daysInMonth) {
                miniWeeks.push(thisWeek);
                thisWeek = new Array(7).fill(null);
              }
            });

            return (
              <div key={mIndex} className="year-month-block">
                <div className="year-month-header">{mDate.format("MMMM")}</div>
                <div className="year-month-table">
                  <div className="year-month-row year-days-header">
                    {dayLabelsShort.map((lbl, idx) => (
                      <div key={idx} className="year-month-cell header-cell">
                        {lbl}
                      </div>
                    ))}
                  </div>
                  {miniWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="year-month-row">
                      {week.map((day, dIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={dIdx}
                              className="year-month-cell empty-cell"
                            />
                          );
                        }

                        const isToday = dayjs(day).isSame(dayjs(), "day");

                        const dayEvents = sampleEvents.filter((ev) =>
                          dayjs(ev.startTime).isSame(day, "day")
                        );
                        return (
                          <div
                            key={dIdx}
                            className={`year-month-cell ${
                              isToday ? "current-day" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDayClick(day)}
                          >
                            <span className="year-month-date">
                              {day.date()}
                            </span>
                            {dayEvents.length > 0 && (
                              <div className="year-event-indicator" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderHeaderControls()}
      {selectedView === "Day" && renderDayView()}
      {selectedView === "Week" && renderWeekView()}
      {selectedView === "Month" && renderMonthView()}
      {selectedView === "Year" && renderYearView()}

      {showDayPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">{popupDate?.format("MMMM D, YYYY")}</h3>
            {popupEvents.length === 0 ? (
              <p>No events</p>
            ) : (
              <ul className="popup-events-list">
                {popupEvents.map((ev, idx) => (
                  <li key={idx} className="popup-event-item">
                    <strong>{ev.title}</strong>
                    <p className="popup-event-time">
                      {dayjs(ev.startTime).format("h:mm A")} -{" "}
                      {dayjs(ev.endTime).format("h:mm A")}
                    </p>
                    {ev.details && (
                      <p className="popup-event-details">{ev.details}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <button className="popup-close-btn" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AvailabilityCalendarView;
