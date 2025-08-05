import React from 'react';
import styles from './TrainerCard.module.css';

export default function TrainerCard({ img, name, title, achievements, bio }) {
  return (
    <div className={styles.trainerCard}>
      <div className={styles.trainerImage}>
        <img src={img} alt={`${name} – Fitness Trainer`} />
        <div className={styles.trainerInfo}>
          <h2>
            Meet <span>{name}</span>
          </h2>
          <p className={styles.title}>{title}</p>
          <ul className={styles.achievements}>
            {achievements.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
          <p className={styles.bio}>{bio}</p>
        </div>
      </div>
    </div>
  );
}
