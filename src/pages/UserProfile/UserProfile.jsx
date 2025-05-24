import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaPencilAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    mobile: false
  });

  useEffect(() => {
    // Get user profile from session storage
    const profile = sessionStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleEdit = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSave = (field, value) => {
    if (!value.trim()) return;

    const updatedProfile = {
      ...userProfile,
      [field]: value
    };

    // Update session storage
    sessionStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
  };

  if (!userProfile) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard')}
        >
          <FaArrowLeft />
        </button>
        <Logo />
        <FaUserCircle className={styles.userIcon} />
      </header>

      <main className={styles.main}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <FaUserCircle className={styles.largeUserIcon} />
            <h1>Profile Information</h1>
          </div>

          <div className={styles.profileFields}>
            <div className={styles.fieldGroup}>
              <label>Name</label>
              <div className={styles.fieldContent}>
                {editMode.name ? (
                  <input
                    type="text"
                    defaultValue={userProfile.name}
                    onBlur={(e) => handleSave('name', e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{userProfile.name}</span>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit('name')}
                    >
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Email</label>
              <div className={styles.fieldContent}>
                {editMode.email ? (
                  <input
                    type="email"
                    defaultValue={userProfile.email}
                    onBlur={(e) => handleSave('email', e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{userProfile.email}</span>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit('email')}
                    >
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Mobile Number</label>
              <div className={styles.fieldContent}>
                {editMode.mobile ? (
                  <input
                    type="tel"
                    defaultValue={userProfile.mobile || ''}
                    onBlur={(e) => handleSave('mobile', e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{userProfile.mobile || 'Not set'}</span>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit('mobile')}
                    >
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
