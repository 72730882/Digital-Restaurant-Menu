import React from "react";
import {
  FaFacebookF,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* LEFT SECTION */}
        <div className="footer-left">
          <p><FaMapMarkerAlt className="icon" /> Adama, Ethiopia</p>
          <p><FaPhoneAlt className="icon" /> +251 972 720 882</p>
          <p><FaEnvelope className="icon" /> info@naflet-hotel.com</p>
          <p>
            <FaMapMarkedAlt className="icon" />
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              View on Google Maps
            </a>
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="footer-right">
          <a href="#" className="social"><FaFacebookF /></a>
          <a href="#" className="social"><FaTiktok /></a>
          <a href="#" className="social"><FaMapMarkedAlt /></a>
        </div>
      </div>

      <div className="footer-copy">
        © {new Date().getFullYear()}  Naflet Hotel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;