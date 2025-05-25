import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPencilAlt, FaArrowLeft } from 'react-icons/fa';
import Logo from '../../components/Logo/Logo';
import instance from '../../utils/apiClient';
import { useAxiosInterceptors } from '../../hooks/useAxiosInterceptors';
import styles from './WorkerProfile.module.css';

const WorkerProfile = () => {
  const navigate = useNavigate();
  const [workerProfile, setWorkerProfile] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone_no: false
  });
  const [errors, setErrors] = useState({});
  const [tempValues, setTempValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize axios interceptors
  useAxiosInterceptors();

  // Session storage helpers
  const getWorkerProfileFromStorage = () => {
    const cached = sessionStorage.getItem('workerProfile');
    return cached ? JSON.parse(cached) : null;
  };

  const saveWorkerProfile = (data) => {
    sessionStorage.setItem('workerProfile', JSON.stringify(data));
  };

  useEffect(() => {
    const loadWorkerProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check for cached profile data from session storage
        const cachedProfile = getWorkerProfileFromStorage();
        
        if (cachedProfile) {
          console.log('Using cached worker profile from session storage:', cachedProfile);
          setWorkerProfile(cachedProfile);
          setTempValues(cachedProfile);
          setLoading(false);
        } else {
          // Fallback to API if no cached data (shouldn't happen normally)
          console.log('No cached profile found, fetching from API...');
          const response = await instance.get('/userdetails');
          console.log('Worker profile API response:', response.data);
          
          const profileData = response.data.profile || response.data;
          console.log('Extracted profile data:', profileData);
          
          setWorkerProfile(profileData);
          setTempValues(profileData);
          saveWorkerProfile(profileData);
        }
      } catch (err) {
        console.error('Error loading worker profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadWorkerProfile();
  }, []);

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phone_no':
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(value)) {
          return 'Please enter a valid 10-digit mobile number';
        }
        break;
      case 'name':
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        break;
    }
    return '';
  };

  const handleEdit = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: true
    }));
    setTempValues(prev => ({
      ...prev,
      [field]: workerProfile[field]
    }));
  };

  const handleChange = (field, value) => {
    setTempValues(prev => ({
      ...prev,
      [field]: value
    }));
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSave = (field) => {
    const value = tempValues[field];
    const error = validateField(field, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
      return;
    }

    const updatedProfile = {
      ...workerProfile,
      [field]: value
    };

    // Update session storage with the new data
    saveWorkerProfile(updatedProfile);
    setWorkerProfile(updatedProfile);
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleRetry = () => {
    sessionStorage.removeItem('workerProfile');
    setError(null);
    setLoading(true);
    
    const loadWorkerProfile = async () => {
      try {
        const response = await instance.get('/userdetails');
        const profileData = response.data.profile || response.data;
        setWorkerProfile(profileData);
        setTempValues(profileData);
        saveWorkerProfile(profileData);
      } catch (err) {
        console.error('Error on retry:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkerProfile();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Something went wrong</h2>
        <p>We couldn't load your profile information</p>
        <button onClick={handleRetry} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (!workerProfile) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/worker-dashboard')}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
        <Logo />
        <div className={styles.headerRight}>
          <FaUserCircle className={styles.userIcon} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.profileCard}>
          <h2>Profile Details</h2>
          
          <div className={styles.fieldGroup}>
            <label>Name</label>
            <div className={styles.fieldContent}>
              {editMode.name ? (
                <div className={styles.editField}>
                  <input
                    type="text"
                    value={tempValues.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    autoFocus
                  />
                  <button 
                    className={styles.saveButton}
                    onClick={() => handleSave('name')}
                    disabled={!!errors.name}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span>{workerProfile.name}</span>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit('name')}
                  >
                    <FaPencilAlt />
                  </button>
                </>
              )}
            </div>
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label>Email</label>
            <div className={styles.fieldContent}>
              {editMode.email ? (
                <div className={styles.editField}>
                  <input
                    type="email"
                    value={tempValues.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    autoFocus
                  />
                  <button 
                    className={styles.saveButton}
                    onClick={() => handleSave('email')}
                    disabled={!!errors.email}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span>{workerProfile.email}</span>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit('email')}
                  >
                    <FaPencilAlt />
                  </button>
                </>
              )}
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label>Mobile</label>
            <div className={styles.fieldContent}>
              {editMode.phone_no ? (
                <div className={styles.editField}>
                  <input
                    type="tel"
                    value={tempValues.phone_no || ''}
                    onChange={(e) => handleChange('phone_no', e.target.value)}
                    className={`${styles.input} ${errors.phone_no ? styles.inputError : ''}`}
                    autoFocus
                    maxLength="10"
                  />
                  <button 
                    className={styles.saveButton}
                    onClick={() => handleSave('phone_no')}
                    disabled={!!errors.phone_no}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span>{workerProfile.phone_no}</span>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit('phone_no')}
                  >
                    <FaPencilAlt />
                  </button>
                </>
              )}
            </div>
            {errors.phone_no && <span className={styles.errorText}>{errors.phone_no}</span>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerProfile;
