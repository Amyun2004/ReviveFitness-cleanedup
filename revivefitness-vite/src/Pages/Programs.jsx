
import ProgramGallery from '../components/GallerySection/ProgramsProvided.jsx';
import ProgramPricingSection from '../components/PricingSection/PricingSection.jsx';
import CurrentChallenge from '../components/CurrentChallangesSection/CurrentChallenge.jsx';
import challangePng from '../assets/img_gym/90-day-transformation.png'


export default function Programs() {

  const current = {
    imageUrl: challangePng,
    title: "90-day-challange",
    description: "Ready to transform your lower body? Join our 30‑day Squat Challenge—daily, expertly crafted workouts designed to sculpt powerful legs, boost endurance, and unlock your inner strength. Let’s squat to success together!"
  }
  return (
    
    <div>
      <CurrentChallenge{...current}/>
      <ProgramGallery/>
      <ProgramPricingSection/>
    </div>
  );
}
