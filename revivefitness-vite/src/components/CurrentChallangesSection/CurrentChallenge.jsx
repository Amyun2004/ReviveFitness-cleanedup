// src/components/ProgramsPage/CurrentChallenge/CurrentChallenge.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CurrentChallenge.module.css';
import ChallengeDetailsModal from '../ChallengeDetailsModal/ChallengeDetailsModal';

export default function CurrentChallenge({ imageUrl, title, description }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // sample data — swap these out for real props or context
  const price    = '$29.99';
  const duration = '4 Weeks';
  const benefits = [
    'Improved strength & endurance',
    'Better workout consistency',
    'Community support & accountability',
  ];

  return (
    <section className={styles.container}>
      <h2 className="heading">
        Current<span> Challenges</span>
      </h2>

      <div className={styles.card}>
        <img src={imageUrl} alt={title} className={styles.image} />
        <div className={styles.overlay}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.desc}>{description}</p>
          <button
            className={styles.cta}
            onClick={() => setShowModal(true)}
          >
            Learn More
          </button>
        </div>
      </div>

      {showModal && (
        <ChallengeDetailsModal
          title={title}
          description={description}
          price={price}
          duration={duration}
          benefits={benefits}
          onClose={() => setShowModal(false)}
          onJoin={() => {
            setShowModal(false);
            navigate('/join-us');
          }}
        />
      )}
    </section>
  );
}
