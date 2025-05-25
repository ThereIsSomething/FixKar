import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaHandshake, FaTasks, FaHistory, FaStar } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Logo from '../../components/Logo/Logo';
import styles from './WorkerDashboard.module.css';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [workerProfile, setWorkerProfile] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    try {
      const token = "dfac02cd534d4a";
      const response = await axios.get(`https://ipinfo.io/json?token=${token}`);
      setLocation(response.data);
      sessionStorage.setItem('workerLocation', JSON.stringify(response.data));
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get cached data
        const cachedProfile = sessionStorage.getItem('workerProfile');
        const cachedLocation = sessionStorage.getItem('workerLocation');

        if (cachedProfile) {
          setWorkerProfile(JSON.parse(cachedProfile));
        } else {
          // Mock data to match the design
          const mockProfile = {
            name: 'Peter Johnson',
            services: {
              active: 3,
              completed: 6
            },
            rating: {
              average: 4.8,
              total: 156
            }
          };
          setWorkerProfile(mockProfile);
          sessionStorage.setItem('workerProfile', JSON.stringify(mockProfile));
        }

        if (cachedLocation) {
          setLocation(JSON.parse(cachedLocation));
        } else {
          await fetchLocation();
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${styles.star} ${index < Math.floor(rating) ? styles.starFilled : styles.starEmpty}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Logo />
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.profileButton}
              onClick={() => navigate('/workerprofile')}
            >
              <FaUserCircle className={styles.profileIcon} />
            </button>
          </div>
        </header>

        <section className={styles.welcomeSection}>
          <h1 className={styles.welcomeText}>
            Hi {workerProfile?.name}
          </h1>
          {location && (
            <div className={styles.locationText}>
              <MdLocationOn />
              {location.city}, {location.region}
            </div>
          )}
        </section>

        <section className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <FaHandshake />
            </div>
            <span className={styles.cardText}>Service Requests</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <FaTasks />
            </div>
            <span className={styles.cardText}>Active Tasks</span>
            {workerProfile?.services?.active > 0 && (
              <span className={styles.badge}>{workerProfile.services.active}</span>
            )}
          </div>

          <div className={`${styles.card} ${styles.wideCard}`}>
            <div className={styles.cardIcon}>
              <FaHistory />
            </div>
            <span className={styles.cardText}>Past Jobs</span>
            <span className={styles.countText}>
              {workerProfile?.services?.completed || 6} services
            </span>
          </div>
        </section>
      </div>

      <footer className={styles.ratingSection}>
        <div className={styles.ratingContent}>
          <div className={styles.ratingStars}>
            {renderStars(workerProfile?.rating?.average || 0)}
            <span className={styles.ratingNumber}>
              {workerProfile?.rating?.average.toFixed(1)}
            </span>
          </div>
          <div className={styles.ratingTotal}>
            {workerProfile?.rating?.total} ratings
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkerDashboard;
