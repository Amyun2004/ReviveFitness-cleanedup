// src/components/ProgramsPage/CurrentChallenge/ChallengeDetailsModal.jsx
import React from 'react';
import styles from '../CurrentChallangesSection/CurrentChallenge.module.css';

export default function ChallengeDetailsModal({
  title,
  description,
  price,
  duration,
  benefits,
  onClose,
  onJoin
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>

        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalDesc}>{description}</p>

        <div className={styles.modalInfo}>
          <div className={styles.infoGroup}>
            <h4>Price</h4>
            <p>{price}</p>
          </div>

          <div className={styles.infoGroup}>
            <h4>Duration</h4>
            <p>{duration}</p>
          </div>

          <div className={styles.infoGroup}>
            <h4>What You’ll Gain</h4>
            <ul>
              {benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <button className={styles.joinBtn} onClick={onJoin}>
          Join the challenge
        </button>
      </div>
    </div>
  );
}
