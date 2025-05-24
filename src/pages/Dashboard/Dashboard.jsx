import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaHandsHelping, FaClipboardList, FaHistory } from 'react-icons/fa';
import { getUserEmail, clearAuthenticationState } from '../../utils/auth';
import Logo from '../../components/Logo/Logo';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = getUserEmail();
  const [userProfile, setUserProfile] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Session storage helpers
  const saveLocationData = (data) => {
    sessionStorage.setItem('userLocation', JSON.stringify(data));
  };

  const getLocationData = () => {
    const cached = sessionStorage.getItem('userLocation');
    return cached ? JSON.parse(cached) : null;
  };

  const saveUserProfile = (data) => {
    sessionStorage.setItem('userProfile', JSON.stringify(data));
  };

  const getUserProfileFromStorage = () => {
    const cached = sessionStorage.getItem('userProfile');
    return cached ? JSON.parse(cached) : null;
  };

  // Mock user data fetch with session storage
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if data exists in session storage
      const cachedProfile = getUserProfileFromStorage();
      if (cachedProfile) {
        setUserProfile(cachedProfile);
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API response with realistic data
      const mockProfile = {
        name: 'Peter Johnson',
        id: '12345',
        email: userEmail || 'peter.johnson@example.com',
        joinedDate: '2024-01-15',
        services: {
          active: [
            { id: 1, name: 'House Cleaning', date: '2024-05-20' },
            { id: 2, name: 'Plumbing Repair', date: '2024-05-22' },
            { id: 3, name: 'Garden Maintenance', date: '2024-05-25' }
          ],
          past: [
            { id: 4, name: 'Electrical Work', date: '2024-04-15' },
            { id: 5, name: 'Painting', date: '2024-04-10' },
            { id: 6, name: 'Carpet Cleaning', date: '2024-03-28' },
            { id: 7, name: 'Window Cleaning', date: '2024-03-20' },
            { id: 8, name: 'Pest Control', date: '2024-03-15' },
            { id: 9, name: 'AC Repair', date: '2024-03-10' }
          ]
        }
      };

      // Store in session storage
      saveUserProfile(mockProfile);
      setUserProfile(mockProfile);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  // Fetch user location using IP API
  const fetchUserLocation = async () => {
    try {
      // Check session storage first
      const cachedLocation = getLocationData();
      
      if (cachedLocation) {
        setUserLocation(cachedLocation);
        return;
      }
      
      const token = "dfac02cd534d4a"; 
      const response = await axios.get(`https://ipinfo.io/json?token=${token}`);
      setUserLocation(response.data);
      saveLocationData(response.data);
    } catch (err) {
      console.error("Failed to fetch location", err);
      setUserLocation({ city: 'Unknown', region: 'Location' });
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserLocation();
  }, []);

  // Handle logout
  const handleLogout = () => {
    clearAuthenticationState();
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('userLocation');
    navigate('/login');
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchUserProfile();
    fetchUserLocation();
  };

  // Handle service card clicks
  const handleHireService = () => {
    console.log('Navigate to hire service page');
  };

  const handleActiveServices = () => {
    console.log('Navigate to active services page');
  };

  const handlePastServices = () => {
    console.log('Navigate to past services page');
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
        <button onClick={handleRetry} className={styles.retryButton}>
          Try Againhi now i want to design one new tool name with 
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Logo />
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.profileButton}
            onClick={() => navigate('/profile')}
            title="View Profile"
          >
            <FaUserCircle className={styles.profileIcon} />
            {userProfile?.name && (
              <span className={styles.profileName}>
                {userProfile.name}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeText}>
          Hi {userProfile?.name || 'User'},
        </h1>
        <p className={styles.locationText}>
          {userLocation ? 
            `${userLocation.city}, ${userLocation.region}` : 
            'Detecting location...'}
        </p>
      </section>

      {/* Service Cards */}
      <section className={styles.cardGrid}>
        <div className={styles.card} onClick={handleHireService}>
          <div className={styles.cardIcon}>
            <FaHandsHelping />
          </div>
          <span className={styles.cardText}>Hire a service</span>
        </div>

        <div className={styles.card} onClick={handleActiveServices}>
          <div className={styles.cardIcon}>
            <FaClipboardList />
          </div>
          <span className={styles.cardText}>Active services</span>
          {userProfile?.services?.active?.length > 0 && (
            <span className={styles.badge}>{userProfile.services.active.length}</span>
          )}
        </div>

        <div className={`${styles.card} ${styles.wideCard}`} onClick={handlePastServices}>
          <div className={styles.cardIcon}>
            <FaHistory />
          </div>
          <span className={styles.cardText}>Past services</span>
          {userProfile?.services?.past?.length > 0 && (
            <span className={styles.countText}>{userProfile.services.past.length} services</span>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
