import { useState, useEffect } from 'react';
import ProgramGallery from '../components/GallerySection/ProgramsProvided.jsx';
import ProgramPricingSection from '../components/PricingSection/PricingSection.jsx';
import CurrentChallenge from '../components/CurrentChallangesSection/CurrentChallenge.jsx';

export default function Programs() {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current challenge from backend
    fetch('http://localhost:8080/api/current-challenges')
      .then(res => res.json())
      .then(data => {
        setCurrentChallenge(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching challenge:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div>
      {currentChallenge && (
  <CurrentChallenge
    title={currentChallenge.title}
    description={currentChallenge.description}
    imageUrl={currentChallenge.imageUrl || currentChallenge.image_url}
    /* etc */
  />
)}
      <ProgramGallery />
      <ProgramPricingSection />
    </div>
  );
}