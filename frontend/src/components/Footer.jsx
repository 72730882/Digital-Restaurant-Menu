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
      {/* TOP: Left Text & Right Social */}
      <div className="footer-top">
        {/* LEFT */}
        <div className="footer-left">
          <p><FaMapMarkerAlt className="icon" /> Addis Ababa, Ethiopia</p>
          <p><FaPhoneAlt className="icon" /> +251 912 345 678</p>
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

        {/* RIGHT */}
        <div className="footer-right">
          <a href="#" className="social"><FaFacebookF /></a>
          <a href="#" className="social"><FaTiktok /></a>
          <a href="#" className="social"><FaMapMarkedAlt /></a>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-copy">
        © {new Date().getFullYear()} Faiza Mohammed. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
