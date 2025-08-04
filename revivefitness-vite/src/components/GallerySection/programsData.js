// src/components/ProgramPage/programsData.js
import bodybuildingImg    from '../../assets/img_gym/Bodybuilding2.png';
import OnlineCoachingImg  from '../../assets/img_gym/Online_Coaching.png';
import StrengthTrainingImg from '../../assets/img_gym/StrengthTraining.png';
import FatLossImg         from '../../assets/img_gym/FatLoss.png';
import PersonalTrainingImg from '../../assets/img_gym/personal coaching.png';

export const programs = [
  {
    id: 'bodybuilding',
    title: 'Bodybuilding',
    img: bodybuildingImg,
    desc: 'Build strength, size, and aesthetics with guidance from our expert trainers. Personalized workout routines & nutrition plans.',
    cost: 'Rs 5,000 / month',
    duration: '3 months'
  },
  {
    id: 'online-coaching',
    title: 'Online Coaching',
    img: OnlineCoachingImg,
    desc: 'Train from home with live video sessions, custom meal plans, and 24/7 chat support.',
    cost: 'Rs 3,000 / month',
    duration: 'Flexible'
  },
  {
    id: 'strength-training',
    title: 'Strength Training',
    img: StrengthTrainingImg,
    desc: 'Increase your functional strength using compound movements, kettlebells, and bodyweight exercises.',
    cost: 'Rs 4,000 / month',
    duration: '2 months'
  },
  {
    id: 'fat-loss',
    title: 'Fat Loss',
    img: FatLossImg,
    desc: 'Burn fat efficiently with HIIT circuits, metabolic conditioning, and nutrition coaching.',
    cost: 'Rs 4,500 / month',
    duration: '2 months'
  },
  {
    id: 'personal-training',
    title: 'Personal Training',
    img: PersonalTrainingImg,
    desc: 'One‑on‑one sessions tailored exactly to your goals, with hands‑on form correction and motivation.',
    cost: 'Rs 8,000 / month',
    duration: '1 month'
  }
];
