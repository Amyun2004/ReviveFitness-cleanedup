// src/components/AboutPage/TrainerSection/TrainerCard/TrainerCard.jsx

import React from 'react';
import styles from './TrainerCard.module.css'; // Import the CSS Module

export default function TrainerCard({ img, name, title, achievements, bio }) {
  return (
    <div className={styles.trainerCard}> {/* Apply module class */}
      <div className={styles.trainerImage}> {/* Apply module class */}
        <img src={img} alt={`${name} - Fitness Trainer`} />
        <div className={styles.trainerInfo}> {/* Apply module class */}
          <h2>
            Meet <span>{name}</span>
          </h2>
          <p className={styles.title}>{title}</p> {/* Apply module class */}
          <ul className={styles.achievements}> {/* Apply module class */}
            {achievements.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
          <p className={styles.bio}>{bio}</p> {/* Apply module class */}
        </div>
      </div>
    </div>
  );
}