import React, { useState, useEffect } from 'react';
import TrainerCard from '../TrainerCard/TrainerCard';
import styles from './TrainerSection.module.css';

export default function TrainerSection() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/trainers')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setTrainers(data))
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading trainers...</p>;
  if (error)   return <p>Error loading trainers: {error}</p>;

  return (
    <section>
      <h2 className="heading">Our <span>Trainers</span></h2>
      <div className={styles.aboutContainer}>
        {trainers.map(t => (
          <TrainerCard
            key={t.id}
            img={t.imgUrl}
            name={t.name}
            title={t.title}
            achievements={t.achievements}
            bio={t.bio}
          />
        ))}
      </div>
    </section>
  );
}
