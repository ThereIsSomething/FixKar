import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaHandsHelping, FaClipboardList, FaHistory } from 'react-icons/fa';
import { getUserEmail, clearAuthenticationState } from '../../utils/auth';
import { useAxiosInterceptors } from '../../hooks/useAxiosInterceptors';
import instance from '../../utils/apiClient';
import Logo from '../../components/Logo/Logo';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = getUserEmail();
  const [userProfile, setUserProfile] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize axios interceptors
  useAxiosInterceptors();

  // Clear all cached data (temporary for debugging)
  const clearAllCache = () => {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('userDetails');
    sessionStorage.removeItem('userLocation');
    console.log('Cleared all cached data');
  };

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

  const saveUserDetails = (data) => {
    sessionStorage.setItem('userDetails', JSON.stringify(data));
  };

  const getUserDetailsFromStorage = () => {
    const cached = sessionStorage.getItem('userDetails');
    return cached ? JSON.parse(cached) : null;
  };

  // Fetch profile name from backend API
  const fetchProfileName = async () => {
    try {
      const response = await instance.get('/getprofilename');
      console.log('Profile name API response:', response.data);
      
      // Try multiple ways to extract the name
      let name = 'User';
      
      if (typeof response.data === 'string') {
        name = response.data;
      } else if (response.data?.name && typeof response.data.name === 'string') {
        name = response.data.name;
      } else if (response.data?.profile?.name && typeof response.data.profile.name === 'string') {
        name = response.data.profile.name;
      }
      
      console.log('Extracted name:', name, 'Type:', typeof name);
      return name;
    } catch (err) {
      console.error('Failed to fetch profile name:', err);
      return 'User'; // Return default instead of throwing
    }
  };

  // Fetch user details from backend API
  const fetchUserDetails = async () => {
    try {
      const response = await instance.get('/userdetails');
      console.log('User details API response:', response.data);
      return response.data; // Should contain email, phone, name
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      throw err;
    }
  };

  // Fetch user profile data from backend APIs
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if data exists in session storage
      const cachedProfile = getUserProfileFromStorage();
      const cachedDetails = getUserDetailsFromStorage();
      
      if (cachedProfile && cachedDetails) {
        const cachedUserData = { ...cachedProfile, ...cachedDetails };
        console.log('Using cached data:', cachedUserData);
        console.log('Cached name:', cachedUserData.name, 'Type:', typeof cachedUserData.name);
        
        // Extract the correct name from the profile object
        let finalName = 'User';
        if (typeof cachedUserData.name === 'string') {
          finalName = cachedUserData.name;
        } else if (cachedUserData.profile && typeof cachedUserData.profile.name === 'string') {
          finalName = cachedUserData.profile.name;
        } else if (typeof cachedProfile.name === 'string') {
          finalName = cachedProfile.name;
        }
        
        cachedUserData.name = finalName;
        console.log('Final extracted name:', finalName);
        console.log('Final cached user data before setState:', cachedUserData);
        console.log('Name property type:', typeof cachedUserData.name);
        
        setUserProfile(cachedUserData);
        setLoading(false);
        return;
      }

      // Fetch data from backend APIs
      const [profileName, userDetails] = await Promise.all([
        fetchProfileName(),
        fetchUserDetails()
      ]);

      // Create combined profile object
      const profileData = {
        name: profileName,
        id: userDetails.id || Date.now().toString(), // Use ID from userDetails or generate one
        joinedDate: userDetails.joinedDate || new Date().toISOString().split('T')[0],
        services: {
          active: [],
          past: []
        }
      };

      // Combine data carefully to avoid overwriting the name
      const combinedUserData = {
        ...userDetails, // Include all user details first
        ...profileData, // Then override with profile data (including the correct name)
      };

      // Double-check that we have the right name
      if (userDetails.profile && typeof userDetails.profile.name === 'string') {
        combinedUserData.name = userDetails.profile.name;
      } else if (typeof profileName === 'string') {
        combinedUserData.name = profileName;
      } else {
        combinedUserData.name = 'User';
      }

      console.log('Final combined user data:', combinedUserData);
      console.log('Final user name:', combinedUserData.name, 'Type:', typeof combinedUserData.name);
      console.log('Final data before setState:', combinedUserData);

      // Store data in session storage
      saveUserProfile(profileData);
      saveUserDetails(userDetails);
      
      setUserProfile(combinedUserData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
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
    // Clear cache temporarily to fix the object rendering issue
    clearAllCache();
    
    fetchUserProfile();
    fetchUserLocation();
  }, []);

  // Handle logout
  const handleLogout = () => {
    clearAuthenticationState();
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('userDetails');
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
    navigate('/hire-service');
  };

  const handleActiveServices = () => {
    console.log('Navigate to active services page');
  };

  const handlePastServices = () => {
    console.log('Navigate to past services page');
  };

  // Debug function to safely render user name
  const renderUserName = (name) => {
    console.log('Rendering name:', name, 'Type:', typeof name);
    if (typeof name === 'string') {
      return name;
    } else if (name && typeof name === 'object') {
      console.error('Attempted to render object as name:', name);
      return 'User';
    }
    return 'User';
  };

  // Add final safety check for userProfile before rendering
  useEffect(() => {
    if (userProfile) {
      console.log('UserProfile state updated:', userProfile);
      console.log('UserProfile.name:', userProfile.name, 'Type:', typeof userProfile.name);
      
      // Fix any object names that might have slipped through
      if (userProfile.name && typeof userProfile.name !== 'string') {
        console.warn('Fixing non-string name in userProfile');
        const fixedProfile = { ...userProfile };
        if (userProfile.profile && typeof userProfile.profile.name === 'string') {
          fixedProfile.name = userProfile.profile.name;
        } else {
          fixedProfile.name = 'User';
        }
        setUserProfile(fixedProfile);
      }
    }
  }, [userProfile]);

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
            onClick={() => {
              // Ensure data is available before navigating
              if (userProfile) {
                navigate('/profile');
              }
            }}
            title="View Profile"
          >
            <FaUserCircle className={styles.profileIcon} />
            {userProfile?.name && typeof userProfile.name === 'string' && (
              <span className={styles.profileName}>
                {renderUserName(userProfile.name)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeText}>
          Hi {renderUserName(userProfile?.name)},
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
