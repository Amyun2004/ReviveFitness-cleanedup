// src/components/HomePage/HeroSection/HeroSection.jsx

import React from "react";
import ReviveLogo from '../../assets/logo/Revivefitness.png'; // Assuming this is correct path
import model from '../../assets/img_gym/sreejandaiback2a.png'; // Background image for Hero
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css'; // Import the CSS Module

export default function HeroSection() {
  return (
    // Apply styles.heroSection. Note: id="home" can remain for direct linking/scrolling if needed.
    <section id="home" className={styles.heroSection} style={{backgroundImage: `url(${model})`}}>
      {/* The .about-content from your original Intro.jsx is nested here, so it gets module-scoped */}
      <div className={styles.aboutContent}>
        <img src={ReviveLogo} alt="ReviveFitness.np" className={styles.reviveLogo} /> {/* Changed id="logo" to className={styles.reviveLogo} */}
        <p className={styles.quote}>“Unleash your true self”</p>
        <p className={styles.aboutTrainers}>with Nepal's Best Trainer(s)</p>
        <div className="nav-btn"> {/* Keeping 'nav-btn' global if it's general purpose */}
          <Link to="/signup" className="navBtnWrapper">Join Us</Link>
        </div>
      </div>
    </section>
  );
}