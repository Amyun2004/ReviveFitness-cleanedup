import React, { useState, useEffect } from 'react';
import ProgramDetailsModal from '../ProgramDetail/ProgramDetailsModal';
import styles from './ProgramGallery.module.css';

export default function ProgramsProvided() {
  const [programs, setPrograms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch programs from backend
    fetch('http://localhost:8080/api/programs')
      .then(res => res.json())
      .then(data => {
        // Transform backend data to match frontend structure
        const transformedPrograms = data.map(program => ({
          id: program.id,
          title: program.name,
          img: program.imageUrl || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(program.name),
          desc: program.description,
          cost: program.benefits || 'Contact for pricing',
          duration: program.duration || 'Flexible'
        }));
        setPrograms(transformedPrograms);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching programs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading programs...</div>;
  }

  if (programs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 className="heading">Our <span>Programs</span></h2>
        <p>No programs available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="heading">Our <span>Programs</span></h2>
      <span className={styles.scrollHint}>⇠ Scroll ⇢</span>

      <div className={styles.servicesContent}>
        {programs.map(prog => (
          <div
            key={prog.id}
            className={styles.row}
            onClick={() => setSelected(prog)}
          >
            <div className={styles.imgWrapper}>
              <img src={prog.img} alt={prog.title} />
              <div className={styles.imgOverlay} />
              <div className={styles.overlayText}>{prog.title}</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ProgramDetailsModal
          program={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}