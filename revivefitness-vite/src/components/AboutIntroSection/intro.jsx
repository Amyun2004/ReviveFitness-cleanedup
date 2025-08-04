import React from "react";
import ReviveLogo from "../../assets/logo/Revivefitness.png";
import model from '../../assets/img_gym/sreejandaiback2a.png';
// REMOVE THIS LINE: import Signup from '../LoginPage/SignupReviveFitness';
// REMOVE THIS LINE: import {useState} from 'react';
import { Link } from 'react-router-dom'; // Import Link

export default function Intro() {
  // REMOVE THIS LINE: const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <section id="home" style={{backgroundImage: `url(${model})`}}>
        <div className="about-content">
          <img src={ReviveLogo} alt="ReviveFitness.np" id="logo" />
          <p className="quote">“Unleash your true self”</p>
          <p className="about-trainers">with Nepal's Best Trainer(s)</p>
          <div className="nav-btn">
            {/* Change this to Link */}
            <Link to="/signup">Join Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}