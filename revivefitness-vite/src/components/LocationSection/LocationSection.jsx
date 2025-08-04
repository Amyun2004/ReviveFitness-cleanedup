// src/components/AboutPage/LocationSection.jsx
import styles from './LocationSection.module.css';

export default function LocationSection() {
  return (
    <section id="Location">
      <div className="container"> {/* reuse global container */}
        <h2 className="heading">Our <span>Location</span></h2>
        <p className="reg-texts">Find us here:</p>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7151.956323738614!2d85.33305797814086!3d27.701364653258025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190033216315%3A0xcd6fa34b347236d9!2sRevive%20Fitness%20Nepal!5e0!3m2!1sen!2snp!4v1751704058078!5m2!1sen!2snp"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          />
        </div>
      </div>
    </section>
  );
}
