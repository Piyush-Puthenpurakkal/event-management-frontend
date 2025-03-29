import React, { useContext } from "react";
import plusIcon from "../assets/Availability/plus.png";
import copyIcon from "../assets/Availability/copy.png";
import deleteIcon from "../assets/Availability/x.png";
import { ToastContext } from "../context/ToastContext";

export default function AvailabilityListView({
  days,
  handleUnavailableChange,
  handleAddInterval,
  handleRemoveInterval,
  handleCopyInterval,
  handleIntervalChange,
}) {
  const { addToast } = useContext(ToastContext);

  // Wrap the existing handler to show a toast message after deletion
  const onRemoveInterval = (dIndex, iIndex) => {
    handleRemoveInterval(dIndex, iIndex);
    addToast("success", "Interval removed");
  };

  return (
    <div className="availability-list-card">
      <h3 className="weekly-hours-heading">Weekly hours</h3>
      {days.map((day, dIndex) => (
        <div className="availability-day-row" key={dIndex}>
          <div className="day-label">
            <input
              type="checkbox"
              className="unavailable-checkbox"
              checked={day.unavailable}
              onChange={() => handleUnavailableChange(dIndex)}
            />
            <span className="day-name">{day.day}</span>
          </div>
          {day.unavailable ? (
            <div className="unavailable-text">Unavailable</div>
          ) : (
            <div className="intervals-area">
              <div className="intervals-row-container">
                {day.intervals.length === 0 && (
                  <div className="no-intervals-placeholder">
                    <span className="no-intervals-text">No intervals</span>
                  </div>
                )}
                {day.intervals.map((interval, iIndex) => (
                  <div className="interval-row" key={iIndex}>
                    <div className="start-end-box">
                      <input
                        type="time"
                        value={interval.start || ""}
                        onChange={(e) =>
                          handleIntervalChange(
                            dIndex,
                            iIndex,
                            "start",
                            e.target.value
                          )
                        }
                      />
                      <span className="dash">-</span>
                      <input
                        type="time"
                        value={interval.end || ""}
                        onChange={(e) =>
                          handleIntervalChange(
                            dIndex,
                            iIndex,
                            "end",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="interval-icon delete-icon"
                      onClick={() => onRemoveInterval(dIndex, iIndex)}
                    />
                  </div>
                ))}
              </div>
              <div className="intervals-right-icons">
                <img
                  src={plusIcon}
                  alt="Add Interval"
                  className="interval-icon plus-interval"
                  onClick={() => handleAddInterval(dIndex)}
                />
                <img
                  src={copyIcon}
                  alt="Copy intervals"
                  className="interval-icon copy-icon"
                  onClick={() => {
                    handleCopyInterval(dIndex);
                    addToast("info", "Interval copied");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
