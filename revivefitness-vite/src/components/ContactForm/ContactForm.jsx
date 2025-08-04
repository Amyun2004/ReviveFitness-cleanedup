// src/components/ContactPage/ContactForm/ContactForm.jsx
import { useState } from "react";
import styles from './ContactForm.module.css'; // Import the module CSS

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  // State to hold the status message (success, error, loading)
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    // Create the data payload for the backend API
    const formDataToSend = {
      name: `${form.firstName} ${form.lastName}`, // Combine first and last name
      email: form.email,
      // Default subject line since the form doesn't have a field for it
      subject: "New Contact from Revive Fitness Website",
      // Add phone number to the message body
      message: `Phone: ${form.phone || "Not provided"}\n\n${form.message}`
    };

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Thank you for contacting us! We'll get back to you soon.");
        setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" }); // Clear form
      } else {
        // Use the error message from the backend if available
        setStatus(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Failed to connect to the server. Please check your network.");
    }
    
    // Optionally, clear the status message after a few seconds
    setTimeout(() => {
      setStatus("");
    }, 5000);
  };

  return (
    <section className={styles.contactBox}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone (optional)</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="xxx-xxx-xxxx"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Type your message ..."
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
      {status && <p style={{ marginTop: '1em', color: 'var(--sub-main-color-2)', textAlign: 'center' }}>{status}</p>}
    </section>
  );
}