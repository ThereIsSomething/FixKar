import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaToolbox, FaClipboardCheck, FaHistory } from 'react-icons/fa';
import { getUserEmail, clearAuthenticationState } from '../../utils/auth';
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

  const saveWorkerProfile = (data) => {
    sessionStorage.setItem('workerProfile', JSON.stringify(data));
  };

  const getWorkerProfileFromStorage = () => {
    const cached = sessionStorage.getItem('workerProfile');
    return cached ? JSON.parse(cached) : null;
  };

  // Mock worker data fetch with session storage
  const fetchWorkerProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if data exists in session storage
      const cachedProfile = getWorkerProfileFromStorage();
      if (cachedProfile) {
        setWorkerProfile(cachedProfile);
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API response with realistic data
      const mockProfile = {
        name: 'John Smith',
        id: 'W12345',
        email: getUserEmail() || 'john.smith@example.com',
        joinedDate: '2024-01-15',
        services: {
          requests: [
            { id: 1, type: 'Plumbing', location: 'Downtown', date: '2024-05-26' },
            { id: 2, type: 'Electric', location: 'Westside', date: '2024-05-26' },
            { id: 3, type: 'Plumbing', location: 'Northside', date: '2024-05-27' }
          ],
          active: [
            { id: 4, type: 'Electric', location: 'Eastside', startTime: '10:00 AM' },
            { id: 5, type: 'Plumbing', location: 'Southside', startTime: '2:00 PM' }
          ],
          past: [
            { id: 6, type: 'Electric', location: 'Downtown', date: '2024-05-24' },
            { id: 7, type: 'Plumbing', location: 'Westside', date: '2024-05-23' },
            { id: 8, type: 'Electric', location: 'Northside', date: '2024-05-22' }
          ]
        }
      };

      saveWorkerProfile(mockProfile);
      setWorkerProfile(mockProfile);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  // Fetch location using IP API
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
    fetchWorkerProfile();
    fetchLocation();
  }, []);

  const handleToggleStatus = () => {
    const newStatus = !isLive;
    setIsLive(newStatus);
    sessionStorage.setItem('workerStatus', newStatus ? 'live' : 'offline');
    // Here you would typically make an API call to update the worker's status
  };

  // Handle card clicks
  const handleServiceRequests = () => {
    console.log('Navigate to service requests page');
  };

  const handleActiveTasks = () => {
    console.log('Navigate to active tasks page');
  };

  const handlePastJobs = () => {
    console.log('Navigate to past jobs page');
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
        <h2>Something went wrong</h2>
        <p>We couldn't load your dashboard information</p>
        <button onClick={fetchLocation} className={styles.retryButton}>
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
            title="View Profile"
          >
            <FaUserCircle className={styles.profileIcon} />
            {workerProfile?.name && (
              <span className={styles.profileName}>
                {workerProfile.name}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Welcome Section */}
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

      {/* Service Cards */}
      <section className={styles.cardGrid}>
        <div className={styles.card} onClick={handleServiceRequests}>
          <div className={styles.cardIcon}>
            <FaToolbox />
          </div>
          <span className={styles.cardText}>Service Requests</span>
          {workerProfile?.services?.requests?.length > 0 && (
            <span className={styles.badge}>{workerProfile.services.requests.length}</span>
          )}
        </div>

        <div className={styles.card} onClick={handleActiveTasks}>
          <div className={styles.cardIcon}>
            <FaClipboardCheck />
          </div>
          <span className={styles.cardText}>Active Tasks</span>
          {workerProfile?.services?.active?.length > 0 && (
            <span className={styles.badge}>{workerProfile.services.active.length}</span>
          )}
        </div>

        <div className={`${styles.card} ${styles.wideCard}`} onClick={handlePastJobs}>
          <div className={styles.cardIcon}>
            <FaHistory />
          </div>
          <span className={styles.cardText}>Past Jobs</span>
          {workerProfile?.services?.past?.length > 0 && (
            <span className={styles.countText}>{workerProfile.services.past.length} jobs</span>
          )}
        </div>
      </section>
    </div>
  );
};

export default WorkerDashboard;
