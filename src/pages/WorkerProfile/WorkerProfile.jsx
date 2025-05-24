import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPencilAlt, FaArrowLeft } from 'react-icons/fa';
import Logo from '../../components/Logo/Logo';
import styles from './WorkerProfile.module.css';

const WorkerProfile = () => {
  const navigate = useNavigate();
  const [workerProfile, setWorkerProfile] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    mobile: false
  });
  const [errors, setErrors] = useState({});
  const [tempValues, setTempValues] = useState({});

  useEffect(() => {
    const profile = sessionStorage.getItem('userData');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setWorkerProfile(parsedProfile);
      setTempValues(parsedProfile);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'mobile':
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

    sessionStorage.setItem('userData', JSON.stringify(updatedProfile));
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
              {editMode.mobile ? (
                <div className={styles.editField}>
                  <input
                    type="tel"
                    value={tempValues.mobile || ''}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    className={`${styles.input} ${errors.mobile ? styles.inputError : ''}`}
                    autoFocus
                    maxLength="10"
                  />
                  <button 
                    className={styles.saveButton}
                    onClick={() => handleSave('mobile')}
                    disabled={!!errors.mobile}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span>{workerProfile.mobile}</span>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit('mobile')}
                  >
                    <FaPencilAlt />
                  </button>
                </>
              )}
            </div>
            {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerProfile;
