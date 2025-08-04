// src/components/ContactPage/ContactInfo/ContactInfo.jsx
import styles from './ContactInfo.module.css'; // Import the module CSS
import callIcon from '../../assets/Symbols/call_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import mailIcon from '../../assets/Symbols/mail_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import scheduleIcon from '../../assets/Symbols/schedule_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';

export default function ContactInfo() {
  return (
    <section className={styles.contactInfo}> {/* Apply module class */}
      <ul>
        <li>
          <img src={callIcon} alt="phone-ReviveFitness.np" />
          <span>(+977) 9843567690</span>
        </li>
        <li>
          <img src={mailIcon} alt="email-ReviveFitness.np" />
          <span>revivefitness.np@gmail.com</span>
        </li>
        <li>
          <img src={scheduleIcon} alt="hours-ReviveFitness.np" />
          <span>Sun-Fri 5AM-9PM</span>
        </li>
      </ul>
    </section>
  );
}