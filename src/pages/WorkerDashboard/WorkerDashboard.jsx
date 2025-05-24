import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import Logo from '../../components/Logo/Logo';
import styles from './WorkerDashboard.module.css';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Session storage helpers
  const saveLocationData = (data) => {
    sessionStorage.setItem('workerLocation', JSON.stringify(data));
  };

  const getLocationData = () => {
    const cached = sessionStorage.getItem('workerLocation');
    return cached ? JSON.parse(cached) : null;
  };

  const getWorkerProfileFromStorage = () => {
    const cached = sessionStorage.getItem('userData');
    return cached ? JSON.parse(cached) : null;
  };

  const fetchLocation = async () => {
    try {
      const cachedLocation = getLocationData();
      if (cachedLocation) {
        setLocation(cachedLocation);
        return;
      }

      const token = "dfac02cd534d4a";
      const response = await axios.get(`https://ipinfo.io/json?token=${token}`);
      setLocation(response.data);
      saveLocationData(response.data);
      
      // Store status in session
      const currentStatus = sessionStorage.getItem('workerStatus');
      if (currentStatus) {
        setIsLive(currentStatus === 'live');
      }
    } catch (err) {
      console.error('Error fetching location:', err);
      setError('Could not detect location');
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const profile = getWorkerProfileFromStorage();
        if (!profile) {
          navigate('/login');
          return;
        }
        setWorkerProfile(profile);
        await fetchLocation();
      } catch (err) {
        setError('Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleToggleStatus = () => {
    const newStatus = !isLive;
    setIsLive(newStatus);
    sessionStorage.setItem('workerStatus', newStatus ? 'live' : 'offline');
    // Here you would typically make an API call to update the worker's status
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops!</h2>
        <p>{error}</p>
        <button className={styles.retryButton} onClick={fetchLocation}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Logo />
          <div className={styles.statusToggleContainer}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isLive}
                onChange={handleToggleStatus}
              />
              <span className={styles.slider}></span>
            </label>
            <div className={styles.statusIndicator}>
              {isLive && <div className={styles.statusDot}></div>}
              <span className={styles.statusText}>
                {isLive ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.profileButton} 
            onClick={() => navigate('/worker-profile')}
          >
            <FaUserCircle size={24} />
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <h1 className={styles.welcomeText}>
            Hi {workerProfile?.name || 'Worker'},
          </h1>
          <p className={styles.locationText}>
            {location ? 
              `${location.city}, ${location.region}` : 
              'Detecting location...'}
          </p>
        </section>
      </main>
    </div>
  );
};

export default WorkerDashboard;
