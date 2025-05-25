import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaHandshake, FaTasks, FaHistory, FaStar } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Logo from '../../components/Logo/Logo';
import instance from '../../utils/apiClient';
import { useAxiosInterceptors } from '../../hooks/useAxiosInterceptors';
import styles from './WorkerDashboard.module.css';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [workerProfile, setWorkerProfile] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // Initialize axios interceptors
  useAxiosInterceptors();

  // Fetch worker profile from backend API - always fresh data
  const fetchWorkerProfile = async () => {
    try {
      console.log('Fetching worker profile from /userdetails...');
      const response = await instance.get('/userdetails');
      console.log('Worker profile API response:', response.data);
      
      // Return exactly what the backend sends, no modifications
      return response.data;
    } catch (err) {
      console.error('Failed to fetch worker profile:', err);
      throw err;
    }
  };

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
        setLoading(true);
        setError(null);

        // Always fetch fresh data from API - no caching
        console.log('Fetching fresh worker profile from API...');
        const profileData = await fetchWorkerProfile();
        console.log('Fresh worker profile:', profileData);
        
        // Store the profile data in session storage
        if (profileData && profileData.profile) {
          sessionStorage.setItem('workerProfile', JSON.stringify(profileData.profile));
          console.log('Worker profile stored in session storage:', profileData.profile);
        }
        
        setWorkerProfile(profileData);

        // Handle location (can still use cache for location)
        const cachedLocation = sessionStorage.getItem('workerLocation');
        if (cachedLocation) {
          setLocation(JSON.parse(cachedLocation));
        } else {
          await fetchLocation();
        }
      } catch (err) {
        console.error('Error loading worker dashboard:', err);
        setError('Failed to load dashboard data');
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

  const handleServiceRequests = () => {
    navigate('/worker-dashboard/service-requests');
  };

  const handleActiveTasks = () => {
    navigate('/worker-dashboard/active-tasks');
  };

  const handlePastJobs = () => {
    navigate('/worker-dashboard/past-jobs');
  };

  const handleToggleOnline = async () => {
    const newStatus = !isOnline;
    
    try {
      console.log('Toggling worker status to:', newStatus ? 'online' : 'offline');
      
      // Make API call to toggle endpoint
      const response = await instance.post('toggle', {
        status: newStatus ? 'online' : 'offline'
      });
      
      console.log('Toggle API response:', response.data);
      
      // Update local state only after successful API call
      setIsOnline(newStatus);
      
      // Log the message from backend
      if (response.data.message) {
        console.log('Backend message:', response.data.message);
      }
      
    } catch (err) {
      console.error('Failed to toggle worker status:', err);
      // Show error message or handle error appropriately
      alert('Failed to update your status. Please try again.');
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    // Clear cached data and reload
    sessionStorage.removeItem('workerProfile');
    setError(null);
    setLoading(true);
    
    const loadDashboard = async () => {
      try {
        const profileData = await fetchWorkerProfile();
        
        // Store the profile data in session storage
        if (profileData && profileData.profile) {
          sessionStorage.setItem('workerProfile', JSON.stringify(profileData.profile));
          console.log('Worker profile stored in session storage on retry:', profileData.profile);
        }
        
        setWorkerProfile(profileData);
        
        await fetchLocation();
      } catch (err) {
        console.error('Error on retry:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboard();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Something went wrong</h2>
        <p>We couldn't load your dashboard information</p>
        <button onClick={handleRetry} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Logo />
            <div className={styles.toggleContainer}>
              <div 
                className={`${styles.toggle} ${isOnline ? styles.toggleActive : ''}`}
                onClick={handleToggleOnline}
              >
                <div className={styles.toggleSlider}></div>
              </div>
              {isOnline && <div className={styles.liveDot}></div>}
              <span className={styles.statusText}>
                {isOnline ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.profileButton}
              onClick={() => navigate('/worker-profile')}
            >
              <FaUserCircle className={styles.profileIcon} />
            </button>
          </div>
        </header>

        <section className={styles.welcomeSection}>
          <h1 className={styles.welcomeText}>
            Hi {workerProfile?.profile?.name || 'Worker'}
          </h1>
          {location && (
            <div className={styles.locationText}>
              <MdLocationOn />
              {location.city}, {location.region}
            </div>
          )}
        </section>

        <section className={styles.cardGrid}>
          <div className={styles.card} onClick={handleServiceRequests}>
            <div className={styles.cardIcon}>
              <FaHandshake />
            </div>
            <span className={styles.cardText}>Service Requests</span>
          </div>

          <div className={styles.card} onClick={handleActiveTasks}>
            <div className={styles.cardIcon}>
              <FaTasks />
            </div>
            <span className={styles.cardText}>Active Tasks</span>
            {workerProfile?.services?.active > 0 && (
              <span className={styles.badge}>{workerProfile.services.active}</span>
            )}
          </div>

          <div className={`${styles.card} ${styles.wideCard}`} onClick={handlePastJobs}>
            <div className={styles.cardIcon}>
              <FaHistory />
            </div>
            <span className={styles.cardText}>Past Jobs</span>
            <span className={styles.countText}>
              {workerProfile?.services?.completed || 0} services
            </span>
          </div>
        </section>
      </div>

      <footer className={styles.ratingSection}>
        <div className={styles.ratingContent}>
          <div className={styles.ratingStars}>
            {renderStars(workerProfile?.rating?.average || 0)}
            <span className={styles.ratingNumber}>
              {workerProfile?.rating?.average ? workerProfile.rating.average.toFixed(1) : '0.0'}
            </span>
          </div>
          <div className={styles.ratingTotal}>
            {workerProfile?.rating?.total || 0} ratings
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkerDashboard;
