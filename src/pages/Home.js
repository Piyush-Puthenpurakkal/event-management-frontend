import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

import logoImg from "../assets/logo.png";
import heroImage from "../assets/Home/hero-section.png";
import calendar1 from "../assets/Home/calendar1.png";
import calendar2 from "../assets/Home/calendar2.png";
import avatar from "../assets/Home/avatar.png";
import Audiomack from "../assets/Home/audiomack.png";
import Bandsintown from "../assets/Home/bandsintown.png";
import Bonfire from "../assets/Home/bonfire.png";
import Books from "../assets/Home/books.png";
import BuyMeAGift from "../assets/Home/buymeagift.png";
import Cameo from "../assets/Home/cameo.png";
import Clubhouse from "../assets/Home/clubhouse.png";
import Community from "../assets/Home/community.png";
import ContactDetails from "../assets/Home/contactdetails.png";
import twitterIcon from "../assets/Home/twitter.png";
import instagramIcon from "../assets/Home/instagram.png";
import youtubeIcon from "../assets/Home/youtube.png";
import tiktokIcon from "../assets/Home/tiktok.png";
import cnnctIcon from "../assets/Home/cnnct.png";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-top-bar">
        <img src={logoImg} alt="CNNCT Logo" className="top-bar-logo" />
        <Link to="/signup" className="signup-btn">
          Sign up free
        </Link>
      </header>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>CNNCT – Easy Scheduling Ahead</h1>
          <Link to="/signup" className="join-btn">
            Join now
          </Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Booking" />
        </div>
      </section>

      {/* 3. Simplified Scheduling Section */}
      <section className="simplified-section">
        <h2>Simplified scheduling for you and your team</h2>
        <p>
          Keep track of your events and share your calendar with ease. From
          one-on-one meetings to large group sessions, CNNCT makes it all a
          breeze.
        </p>
      </section>

      {/* 4. Stay Organized Section */}
      <section className="organize-section">
        <div className="organize-text">
          <h2>
            Stay Organized with Your <br /> Calendar &amp; Meetings
          </h2>
          <p>Seamless Event Scheduling</p>
          <ul>
            <li>
              View all your upcoming meetings and appointments in one place.
            </li>
            <li>
              Syncs with Google Calendar, Outlook, and iCloud to avoid
              conflicts.
            </li>
            <li>
              Customize event types: one-on-ones, team meetings, group sessions,
              and webinars.
            </li>
          </ul>
        </div>
        <div className="organize-images">
          <img src={calendar1} alt="Calendar 1" className="calendar-img1" />
          <img src={calendar2} alt="Calendar 2" className="calendar-img2" />
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="testimonials-section">
        <div class="testimonials-header">
          <div class="testimonials-left">
            <h2 class="testimonials-title">
              Here’s what our <span class="blue-text">customer</span> <br />
              have to say
            </h2>
            <button class="read-stories-btn">Read customer stories</button>
          </div>

          <div class="testimonials-right">
            <span class="star-icon">*</span>
            <p class="short-description">
              Short describing pitch in here, <br />
              lorem ipsum a placeholder text to demonstrate
            </p>
          </div>
        </div>

        <div className="testimonial-cards">
          {/* Card 1 */}
          <div className="testimonial-card">
            <p>
              “Amazing tool! Saved me months of back-and-forth scheduling. The
              integrated calendar is a lifesaver.”
            </p>
            <div className="testimonial-header">
              <img src={avatar} alt="User" className="testimonial-avatar" />
              <div>
                <h4>John Master</h4>
                <p>CEO, Example Corp</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="testimonial-card">
            <p>
              “So easy to use. My clients love the straightforward booking
              process, and I love the time saved.”
            </p>
            <div className="testimonial-header">
              <img src={avatar} alt="User" className="testimonial-avatar" />
              <div>
                <h4>Jane Doe</h4>
                <p>Freelance Consultant</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="testimonial-card">
            <p>
              “The perfect solution for managing our team's availability. We’ve
              seen a big boost in productivity.”
            </p>
            <div className="testimonial-header">
              <img src={avatar} alt="User" className="testimonial-avatar" />
              <div>
                <h4>Sam Smith</h4>
                <p>Marketing Lead</p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="testimonial-card">
            <p>
              “This placeholder testimonial text is another example to fill out
              a four-card layout, ensuring a complete 2×2 grid.”
            </p>
            <div className="testimonial-header">
              <img src={avatar} alt="User" className="testimonial-avatar" />
              <div>
                <h4>Ann Lee</h4>
                <p>Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Integrations Section */}
      <section className="integrations-section">
        <h2>All Link Apps and Integrations</h2>
        <div className="integrations-grid">
          {/* 1. Audiomack */}
          <div className="integration-item">
            <img src={Audiomack} alt="Audiomack" className="integration-icon" />
            <div>
              <h4>Audiomack</h4>
              <p>Add an Audiomack player to your Linktree</p>
            </div>
          </div>

          {/* 2. Bandsintown */}
          <div className="integration-item">
            <img
              src={Bandsintown}
              alt="Bandsintown"
              className="integration-icon"
            />
            <div>
              <h4>Bandsintown</h4>
              <p>Drive ticket sales by listing your events</p>
            </div>
          </div>

          {/* 3. Bonfire */}
          <div className="integration-item">
            <img src={Bonfire} alt="Bonfire" className="integration-icon" />
            <div>
              <h4>Bonfire</h4>
              <p>Display and sell your custom merch</p>
            </div>
          </div>

          {/* 4. Books */}
          <div className="integration-item">
            <img src={Books} alt="Books" className="integration-icon" />
            <div>
              <h4>Books</h4>
              <p>Promote books on your Linktree</p>
            </div>
          </div>

          {/* 5. Buy Me A Gift */}
          <div className="integration-item">
            <img
              src={BuyMeAGift}
              alt="Buy Me A Gift"
              className="integration-icon"
            />
            <div>
              <h4>Buy Me A Gift</h4>
              <p>Let visitors support you with a small gift</p>
            </div>
          </div>

          {/* 6. Cameo */}
          <div className="integration-item">
            <img src={Cameo} alt="Cameo" className="integration-icon" />
            <div>
              <h4>Cameo</h4>
              <p>Make impossible fan connections possible</p>
            </div>
          </div>

          {/* 7. Clubhouse */}
          <div className="integration-item">
            <img src={Clubhouse} alt="Clubhouse" className="integration-icon" />
            <div>
              <h4>Clubhouse</h4>
              <p>Let your community in on the conversation</p>
            </div>
          </div>

          {/* 8. Community */}
          <div className="integration-item">
            <img src={Community} alt="Community" className="integration-icon" />
            <div>
              <h4>Community</h4>
              <p>Let an SMS subscriber list grow</p>
            </div>
          </div>

          {/* 9. Contact Details */}
          <div className="integration-item">
            <img
              src={ContactDetails}
              alt="Contact Details"
              className="integration-icon"
            />
            <div>
              <h4>Contact Details</h4>
              <p>Easily share downloadable contact details</p>
            </div>
          </div>
        </div>
      </section>

      {/* Home.js or a separate Footer.js */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-top-row">
            <div className="footer-buttons">
              <a href="/login" className="footer-login-btn">
                Log in
              </a>
              <a href="/signup" className="footer-signup-btn">
                Sign up free
              </a>
            </div>

            {/* 2. Footer Links */}
            <div className="footer-links-row">
              <ul>
                <li>About CNNCT</li>
                <li>Blog</li>
                <li>Press</li>
                <li>Social Good</li>
                <li>Contact</li>
              </ul>
              <ul>
                <li>Careers</li>
                <li>Getting Started</li>
                <li>Features and How-To</li>
                <li>FAQs</li>
              </ul>
              <ul>
                <li>Terms and Conditions</li>
                <li>Privacy Policy</li>
                <li>Cookie Notice</li>
                <li>Trust Center</li>
              </ul>
            </div>
          </div>

          {/* Bottom row with acknowledgment + social icons */}
          <div className="footer-bottom-row">
            <p className="footer-acknowledgment">
              We acknowledge the Traditional Custodians of the land on which our
              office stands, The Wurundjeri people of the Kulin Nation, and pay
              our respects to Elders past, present and emerging.
            </p>
            <div className="footer-socials">
              <img src={twitterIcon} alt="Twitter" className="social-icon" />
              <img
                src={instagramIcon}
                alt="Instagram"
                className="social-icon"
              />
              <img src={youtubeIcon} alt="YouTube" className="social-icon" />
              <img src={tiktokIcon} alt="TikTok" className="social-icon" />
              <img src={cnnctIcon} alt="Cnnct" className="social-icon" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
