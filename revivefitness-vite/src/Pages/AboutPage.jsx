// src/Pages/AboutPage.jsx

import React from 'react';
import AboutSection from '../components/AboutSection/AboutSection'; // New modularized About section
import TrainerSection from '../components/TrainerSection/TrainerSection'; // Updated Trainer section
import LocationSection from '../components/LocationSection/LocationSection'; // Ensure correct path for LocationSection



export default function About() {
  return (
    <>
      <AboutSection />
      <TrainerSection />
      <LocationSection />

    </>
  );
}