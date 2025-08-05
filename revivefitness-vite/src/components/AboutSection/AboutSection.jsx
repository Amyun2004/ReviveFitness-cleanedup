// src/components/AboutPage/AboutSection/AboutSection.jsx

import React, { useState, useEffect } from 'react';
import rightHandLogo from '../../assets/logo/RandHand.png'; // Corrected path based on typical structure
import { Link } from 'react-router-dom';
import styles from './AboutSection.module.css'; // Import the CSS Module

export default function AboutSection() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/trainers');
        if (response.ok) {
          const trainersData = await response.json();
          setTrainers(trainersData);
        }
      } catch (error) {
        console.error('Failed to fetch trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <section className={styles.sectionAbout}> {/* Apply module class */}
      {/* The 'heading' class is global, so no change here */}
      <h1 className="heading">
        About ReviveFitness
      </h1>
      <div className={styles.contentAbout}> {/* Apply module class */}
        <img
          src={rightHandLogo}
          alt="ReviveFitness Logo"
          className={styles.logoAbout} // Apply module class
        />
        <div className={styles.textAbout}> {/* Apply module class */}
          <h2>Our Story</h2>
          <p>
            ReviveFitness.np was founded with a simple vision: to make fitness accessible, enjoyable, and sustainable for everyone in Nepal. We believe in a holistic approach to health—where mind, body, and community thrive together.
          </p>
          <h2>What We Do</h2>
          <ul>
            <li>Offer a wide range of fitness programs, from yoga and strength training to HIIT and personalized coaching.</li>
            <li>Build a supportive fitness community—both online and offline.</li>
            <li>Provide expert advice, nutrition tips, and progress tracking tools for all levels.</li>
            <li>Organize regular workshops, challenges, and local events to keep you motivated.</li>
          </ul>
          <h2>Why Choose Us?</h2>
          <p>
            At ReviveFitness, our team is passionate, qualified, and always here to guide you—whether you're a beginner or a pro. We're committed to helping you achieve real results, in a supportive and judgment-free zone.
          </p>
          
          {/* Trainers Section */}
          
          
          <div className="nav-btn"> {/* Keep 'nav-btn' global if it's general purpose */}
            <Link to="/signup">Join Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}