import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProgramDetailsModal.module.css';

export default function ProgramDetailsModal({ program, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <img
          src={program.img}
          alt={program.title}
          className={styles.image}
        />
        <h2 className={styles.title}>{program.title}</h2>
        <p className={styles.desc}>{program.desc}</p>
        <p className={styles.meta}><strong>Cost:</strong> {program.cost}</p>
        <p className={styles.meta}><strong>Timeline:</strong> {program.duration}</p>
        <Link to="/login" className={styles.joinBtn}>
          Join Program
        </Link>
      </div>
    </div>
  );
}
