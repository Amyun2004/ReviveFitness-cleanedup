// src/components/HomePage/AboutIntroSection/AboutIntroSection.jsx

import React from 'react';
import RandHandLogo from '../../assets/logo/RandHand.png';
import { Link } from 'react-router-dom';
import styles from './AboutIntroSection.module.css'; // Import the CSS Module

export default function AboutIntroSection() {
  return (
    // Apply module class
    <section className={styles.sectionAbout}>
      {/* The 'heading' class is global, so no change here */}
      <h1 className="heading">
        About ReviveFitness
      </h1>
      <div className={styles.contentAbout}>
        <img
          src={RandHandLogo}
          alt="ReviveFitness Logo"
          className={styles.logoAbout} // Apply module class
        />
        <div className={styles.textAbout}> {/* Apply module class */}
          <h2>Our Story</h2>
          <p>
            ReviveFitness.np was founded with a simple vision: to make fitness
            accessible, enjoyable, and sustainable for everyone in Nepal. We
            believe in a holistic approach to health—where mind, body, and
            community thrive together.
          </p>
        </div>
      </div>
    </section>
  );
}