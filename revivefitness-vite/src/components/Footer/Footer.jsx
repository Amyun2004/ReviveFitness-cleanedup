// src/components/common/Footer/Footer.jsx

import instagramIcon from '../../assets/logo/icons8-instagram.svg';
import facebookIcon from '../../assets/logo/icons8-facebook.svg';
import righthandlogo from '../../assets/logo/RandHand.png';
import { Link } from 'react-router-dom';

// Import the CSS Module
import styles from './Footer.module.css';

export default function Footer() {
  return (
    // Apply styles.footer to the footer tag
    <footer className={styles.footer}>
      {/* Apply styles.footerContainer to the div */}
      <div className={styles.footerContainer}>
        {/* Apply styles.footerLogo to the div */}
        <div className={styles.footerLogo}>
          <img src={righthandlogo} alt="ReviveFitness Logo" />
          <p>Your Journey, Our Passion</p>
        </div>
        {/* Apply styles.footerLinks to the div */}
        <div className={styles.footerLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        {/* Apply styles.footerContact to the div */}
        <div className={styles.footerContact}>
          <h4>Contact Us</h4>
          <p>Email: revivefitness.np@gmail.com</p>
          <p>Phone: +977-9876543210</p>
        </div>
        {/* Apply styles.footerSocial to the div */}
        <div className={styles.footerSocial}>
          <h4>Follow Us</h4>
          <a href="https://www.instagram.com/revivefitness.np?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61566153055972" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" />
          </a>
        </div>
      </div>
      {/* Apply styles.footerBottom to the div */}
      <div className={styles.footerBottom}>
        <p>© 2025 ReviveFitness.np. All rights reserved.</p>
        <a href="privacy.html">Privacy Policy</a> | <a href="terms.html">Terms of Service</a>
      </div>
    </footer>
  );
}