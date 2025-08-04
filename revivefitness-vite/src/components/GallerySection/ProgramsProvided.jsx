import React, { useState } from 'react';
import { programs } from './programsData';
import ProgramDetailsModal from '../ProgramDetail/ProgramDetailsModal';
import styles from './ProgramGallery.module.css';

export default function ProgramsProvided() {
  const [selected, setSelected] = useState(null);

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
