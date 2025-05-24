import React, { useRef } from 'react';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';
import styles from './Landing.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const servicesRef = useRef(null);

  const scrollToServices = (e) => {
    e.preventDefault();
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    { icon: 'fa-wrench', name: 'Plumbing', desc: 'Expert plumbing solutions' },
    { icon: 'fa-bolt', name: 'Electrical', desc: 'Professional electrical services' },
    { icon: 'fa-hammer', name: 'Carpentry', desc: 'Quality woodwork & repairs' },
    { icon: 'fa-broom', name: 'Cleaning', desc: 'Thorough cleaning services' }
  ];

  const features = [
    { icon: 'fa-shield-check', title: 'Verified Experts', desc: 'All service providers are thoroughly vetted' },
    { icon: 'fa-clock', title: 'Quick Response', desc: 'Get help within hours, not days' },
    { icon: 'fa-star', title: 'Quality Assured', desc: 'Satisfaction guaranteed on every service' }
  ];

  const testimonials = [
    { name: 'Sarah M.', role: 'Homeowner', text: 'Found a reliable plumber in minutes!' },
    { name: 'John D.', role: 'Business Owner', text: 'The best platform for finding skilled workers' }
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Logo />
          <nav className={styles.nav}>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/signup" className={styles.navButton}>Get Started</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Your Trusted Partner for Professional Services</h1>
            <p className={styles.subtitle}>
              Connect with verified experts for all your service needs. Quality work, guaranteed satisfaction.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/signup" className={styles.primaryButton}>Get Started</Link>
              <button onClick={scrollToServices} className={styles.secondaryButton}>
                Explore Services
              </button>
            </div>
          </div>
          <div className={styles.heroPattern}></div>
        </section>

        <section ref={servicesRef} className={styles.services}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <i className={`fas ${service.icon} ${styles.serviceIcon}`}></i>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Why Choose FixKar</h2>
          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <i className={`fas ${feature.icon} ${styles.featureIcon}`}></i>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.testimonials}>
          <h2 className={styles.sectionTitle}>What Our Users Say</h2>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <p>"{testimonial.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers today.</p>
            <Link to="/signup" className={styles.ctaButton}>Sign Up Now</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Logo />
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.serviceTypes}>
              <span>Plumbing</span>
              <span>•</span>
              <span>Electrical</span>
              <span>•</span>
              <span>Carpentry</span>
              <span>•</span>
              <span>Cleaning</span>
              <span>•</span>
              <span>And More</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

