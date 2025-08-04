// src/Pages/Home.jsx

import React from 'react'; // Don't forget to import React
// Import the new specific Home page sections
import HeroSection from '../components/HeroSection/HeroSection';
import AboutIntroSection from '../components/AboutIntroSection/AboutIntroSection';

// Keep these as they are already separate components
import TrainerSection from "../components/TrainerSection/TrainerSection"; // Ensure correct path
import ProgramGallery from "../components/GallerySection/ProgramsProvided"; // Ensure correct path (you named it ProgramsProvided earlier, but ProgramGallery is in your tree)
import LocationSection from "../components/LocationSection/LocationSection"; // Ensure correct path


// Import your global CSS file // Make sure this path is correct for your new global.css

export default function Home() {
    return(
        <div>
            <HeroSection/>
            <AboutIntroSection/>
            <TrainerSection/>
            <ProgramGallery/>
            <LocationSection/>
        </div>
    );
}