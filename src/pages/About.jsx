import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.css';

import ShristyImg from '../assets/shristy.jpg';
import AmanImg from '../assets/Aman.jpg';
import AmitImg from '../assets/Amit.jpg';
import MukulImg from '../assets/Mukul.jpg';

const journeySteps = [
  {
    icon: '🎯',
    title: 'Setting the Goal',
    description: 'We began with a simple mission: make habit tracking fun and effective.',
  },
  {
    icon: '🧱',
    title: 'Building the Base',
    description: 'We created a simple structure to visualize, track, and improve habits daily.',
  },
  {
    icon: '🎮',
    title: 'Gamifying the System',
    description: 'We added scores, levels, and rewards to make the experience enjoyable.',
  },
  {
    icon: '🚀',
    title: 'Spreading the Habit',
    description: 'Now we help others stick to their goals and build better routines.',
  },
];

const teamMembers = [
  { img: ShristyImg, alt: 'Shristy Sinha', name: 'Shristy Sinha' },
  { img: AmanImg, alt: 'Aman Kumar Thakur', name: 'Aman Kumar Thakur' },
  { img: AmitImg, alt: 'Amit Kumar Mahato', name: 'Amit Kumar Mahato' },
  { img: MukulImg, alt: 'Mukul Roy', name: 'Mukul Roy' },
];

// Custom hook to detect if element is in viewport for animation trigger
function useInView(threshold = 0.3) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return [ref, isInView];
}

const About = () => {
  useEffect(() => {
    document.body.classList.add('about-page');
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.body.classList.remove('about-page');
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Render journey steps with animation trigger
  const JourneyStep = ({ icon, title, description }) => {
    const [ref, visible] = useInView();
    return (
      <div
        ref={ref}
        className={`${styles.journeyItem} ${visible ? styles.fadeInUp : styles.fadeOutDown}`}
        tabIndex={0}
        aria-label={`${title} step`}
        title={title}
      >
        <div className={styles.journeyIcon}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  };

  // Render team member with tooltip and hover effect
  const TeamMember = ({ img, alt, name, bio }) => (
    <div className={styles.teamMember} tabIndex={0} aria-label={`${name}, ${bio}`}>
      <img src={img} alt={alt} className={styles.teamImg} />
      <h3>{name}</h3>
      <span className={styles.tooltip}>{bio}</span>
    </div>
  );

  return (
    <div className={styles.aboutContainer}>

      {/* What is Gamified Habit Tracker */}
      <section className={`${styles.section} ${styles.sectionIntro}`}>
        <h2 className={styles.sectionHeading}>What is Gamified Habit Tracker?</h2>
        <p className={styles.sectionText}>
          Gamified Habit Tracker is an engaging way to build and maintain habits by turning them into a fun game. Earn rewards,
          level up, and stay motivated as you track your daily goals and form lasting positive routines.
        </p>
      </section>

      {/* Our Journey */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Our Journey</h2>
        <div className={styles.journeyBox}>
          {journeySteps.map(({ icon, title, description }, idx) => (
            <JourneyStep key={idx} icon={icon} title={title} description={description} />
          ))}
        </div>
      </section>

      {/* Meet the Developers */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Meet the Developers</h2>
        <div className={styles.teamBox}>
          {teamMembers.map(({ img, alt, name, bio }, idx) => (
            <TeamMember key={idx} img={img} alt={alt} name={name} bio={bio} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
