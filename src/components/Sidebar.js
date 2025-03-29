import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/sidebar.css";

import logo from "../assets/logo.png";
import eventsIcon from "../assets/sidebar/events.png";
import eventsIconActive from "../assets/sidebar/events-active.png";
import bookingIcon from "../assets/sidebar/booking.png";
import bookingIconActive from "../assets/sidebar/booking-active.png";
import availabilityIcon from "../assets/sidebar/availability.png";
import availabilityIconActive from "../assets/sidebar/availability-active.png";
import settingsIcon from "../assets/sidebar/settings.png";
import settingsIconActive from "../assets/sidebar/settings-active.png";
import userAvatar from "../assets/userAvatar.png";
import plusIcon from "../assets/sidebar/plus.png";
import logoutPopIcon from "../assets/sidebar/logout-pop.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [showLogout, setShowLogout] = useState(false);

  // Track mobile state (width <768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // For mobile: header (top) and bottom nav (sidebar) visibility
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);

  const userSectionRef = useRef(null);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        // When desktop, hide mobile elements immediately.
        setShowMobileHeader(false);
        setShowMobileNav(false);
      } else {
        // Reset for mobile.
        setShowMobileHeader(true);
        setShowMobileNav(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile scroll behavior – only in mobile view
  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        const scrollY =
          window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        // When near top (within 100px), show header only, hide bottom nav.
        if (scrollY < 100) {
          setShowMobileHeader(true);
          setShowMobileNav(false);
        }
        // When near bottom (within 100px of bottom), hide header, show bottom nav.
        else if (docHeight - (scrollY + windowHeight) < 100) {
          setShowMobileHeader(false);
          setShowMobileNav(true);
        }
        // In between, show both.
        else {
          setShowMobileHeader(true);
          setShowMobileNav(true);
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      // Run initial check
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  const handleUserClick = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userSectionRef.current &&
        !userSectionRef.current.contains(e.target)
      ) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user && (user.firstName || user.lastName)
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
      : "Guest";

  return (
    <>
      {/* Desktop Sidebar – visible only on desktop */}
      <aside className="sidebar-desktop">
        <div className="sidebar-logo">
          <img src={logo} alt="CNNCT" onClick={() => navigate("/dashboard")} />
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {({ isActive }) => (
              <div className="sidebar-link-inner">
                <img
                  src={isActive ? eventsIconActive : eventsIcon}
                  alt="Events"
                  className="sidebar-link-icon"
                />
                <span>Events</span>
              </div>
            )}
          </NavLink>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {({ isActive }) => (
              <div className="sidebar-link-inner">
                <img
                  src={isActive ? bookingIconActive : bookingIcon}
                  alt="Booking"
                  className="sidebar-link-icon"
                />
                <span>Booking</span>
              </div>
            )}
          </NavLink>
          <NavLink
            to="/availability"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {({ isActive }) => (
              <div className="sidebar-link-inner">
                <img
                  src={isActive ? availabilityIconActive : availabilityIcon}
                  alt="Availability"
                  className="sidebar-link-icon"
                />
                <span>Availability</span>
              </div>
            )}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {({ isActive }) => (
              <div className="sidebar-link-inner">
                <img
                  src={isActive ? settingsIconActive : settingsIcon}
                  alt="Settings"
                  className="sidebar-link-icon"
                />
                <span>Settings</span>
              </div>
            )}
          </NavLink>
        </nav>
        <button className="create-btn" onClick={() => navigate("/add-event")}>
          <img src={plusIcon} alt="+" className="plus-icon" />
          <span>Create</span>
        </button>
        <div
          className="sidebar-user"
          ref={userSectionRef}
          onClick={handleUserClick}
        >
          <img src={userAvatar} alt="User Avatar" className="user-avatar" />
          <span className="user-name">{displayName}</span>
          {showLogout && (
            <div className="logout-popup" onClick={handleLogout}>
              <img
                src={logoutPopIcon}
                alt="Logout"
                className="logout-popup-icon"
              />
              <span>Sign out</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header and Bottom Navigation – rendered only on mobile */}
      {isMobile && (
        <>
          <header
            className={`sidebar-mobile-header ${
              showMobileHeader ? "visible" : "hidden"
            }`}
          >
            <div className="mobile-header-left">
              <img
                src={logo}
                alt="CNNCT"
                className="mobile-header-logo"
                onClick={() => navigate("/dashboard")}
              />
            </div>
            <div className="mobile-header-right" onClick={handleUserClick}>
              <img
                src={userAvatar}
                alt="User Avatar"
                className="mobile-header-avatar"
              />
            </div>
            {showLogout && (
              <div className="mobile-logout-popup" onClick={handleLogout}>
                <img
                  src={logoutPopIcon}
                  alt="Logout"
                  className="logout-popup-icon"
                />
                <span>Sign out</span>
              </div>
            )}
          </header>
          <nav
            className={`sidebar-mobile-nav ${
              showMobileNav ? "visible" : "hidden"
            }`}
          >
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? eventsIconActive : eventsIcon}
                    alt="Events"
                    className="mobile-nav-icon"
                  />
                  <span>Events</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? bookingIconActive : bookingIcon}
                    alt="Booking"
                    className="mobile-nav-icon"
                  />
                  <span>Booking</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/availability"
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? availabilityIconActive : availabilityIcon}
                    alt="Availability"
                    className="mobile-nav-icon"
                  />
                  <span>Availability</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? settingsIconActive : settingsIcon}
                    alt="Settings"
                    className="mobile-nav-icon"
                  />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </nav>
        </>
      )}
    </>
  );
};

export default Sidebar;
