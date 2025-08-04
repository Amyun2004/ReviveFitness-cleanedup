// src/components/AboutPage/TrainerSection/TrainerSection.jsx

import React from 'react';
import TrainerCard from '../TrainerCard/TrainerCard'; // Corrected import path
import sreejandaiImg from '../../assets/img_gym/sreejandai.png'; // Corrected import path
import styles from './TrainerSection.module.css'; // Import the CSS Module
import Trainer3 from '../../assets/img_gym/Trainer3.png'
import Trainer2 from '../../assets/img_gym/Trainer2.png'

const trainers = [
    {
        img: sreejandaiImg,
        name: "Shreejan Shrestha",
        title: "Certified Fitness Trainer",
        achievements: [
            "💪 2000+ Body Transformations",
            "🏆 9 Years of Professional Experience",
            "🥇🥇🥇 bodybuilder"
        ],
        bio: "With nearly a decade of experience, Shreejan has helped thousands achieve their fitness goals. His personalized coaching style combines science, discipline, and motivation to deliver lasting transformations."
    },
    {
        img: Trainer2,
        name: "Pratik kuwar",
        title: "Trainer and Fitness Coach",
        achievements : [],
        bio: "I'm Pratik a trainer and fitness coach at Revive Fitness, responsible for guiding clients through personalized workout plans, helping with form correction, and supporting their overall fitness journey."
    },

    {
        img: Trainer3,
        name: "Yogesh chand",
        title: "Instructor",
        achievements : [],
        bio: "My name is Yogesh instrutor at Revive fitness and I am here to develop and implement both generalized and personalized exercise and diet programs that improve the fitness and overall well-being of our clients."
    }
];

export default function TrainerSection() {
    return (
        <section>
            {/* The 'heading' class is global, so no change here */}
            <h2 className="heading">Our <span>Trainers</span></h2>
            <div className={styles.aboutContainer}> {/* Apply module class */}
                {trainers.map((t, i) => (
                    <TrainerCard key={i} {...t} />
                ))}
            </div>
        </section>
    );
}