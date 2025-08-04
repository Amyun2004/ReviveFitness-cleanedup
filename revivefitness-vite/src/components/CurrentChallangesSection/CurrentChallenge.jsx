import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CurrentChallenge.module.css';
import ChallengeDetailsModal from '../ChallengeDetailsModal/ChallengeDetailsModal';

export default function CurrentChallenge() {
  const [showModal, setShowModal] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/current-challenges')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // if your API returns an array, grab the first element
        const first = Array.isArray(data) ? data[0] : data;
        setChallenge(first);
      })
      .catch(err => {
        console.error('Error fetching current challenge:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)    return <div className={styles.status}>Loading current challenge…</div>;
  if (error)      return <div className={styles.statusError}>Error: {error}</div>;
  if (!challenge) return <div className={styles.status}>No current challenge found.</div>;

  const { title, description, imageUrl, image_url } = challenge;
  const imgSrc = imageUrl || image_url;

  // static details for the modal (replace with dynamic fields later if you like)
  const price    = '$29.99';
  const duration = '4 Weeks';
  const benefits = [
    'Improved strength & endurance',
    'Better workout consistency',
    'Community support & accountability',
  ];

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>
        Current<span> Challenges</span>
      </h2>

      <div className={styles.card}>
        <img src={imgSrc} alt={title} className={styles.image} />

        <div className={styles.overlay}>
          <h3 className={styles.title}>{title}</h3>
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
