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
    phone_no: false
  });

  useEffect(() => {
    // Get user profile and details from session storage
    const profile = sessionStorage.getItem('userProfile');
    const userDetails = sessionStorage.getItem('userDetails');
    
    if (profile && userDetails) {
      const profileData = JSON.parse(profile);
      const detailsData = JSON.parse(userDetails);
      
      // Combine both data sources and flatten the profile data
      const combinedProfile = {
        ...profileData,
        ...detailsData
      };
      
      // Extract email and phone from nested profile object if it exists
      if (combinedProfile.profile) {
        combinedProfile.email = combinedProfile.profile.email;
        combinedProfile.phone_no = combinedProfile.profile.phone_no;
        combinedProfile.phone = combinedProfile.profile.phone_no; // Add phone alias for consistency
      }
      
      console.log('Combined profile in UserProfile:', combinedProfile);
      setUserProfile(combinedProfile);
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

    // Also update the nested profile object
    if (updatedProfile.profile) {
      if (field === 'email') {
        updatedProfile.profile.email = value;
      } else if (field === 'phone' || field === 'phone_no') {
        updatedProfile.profile.phone_no = value;
        updatedProfile.phone = value; // Keep both for consistency
        updatedProfile.phone_no = value;
      } else if (field === 'name') {
        updatedProfile.profile.name = value;
      }
    }

    // Update both session storage entries
    const profileData = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    const userDetailsData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    
    // Update the appropriate storage based on field
    if (field === 'name') {
      profileData[field] = value;
      if (profileData.profile) {
        profileData.profile.name = value;
      }
      sessionStorage.setItem('userProfile', JSON.stringify(profileData));
    }
    
    if (field === 'email' || field === 'phone' || field === 'phone_no') {
      if (field === 'email') {
        userDetailsData.email = value;
        if (userDetailsData.profile) {
          userDetailsData.profile.email = value;
        }
      } else {
        userDetailsData.phone_no = value;
        userDetailsData.phone = value;
        if (userDetailsData.profile) {
          userDetailsData.profile.phone_no = value;
        }
      }
      sessionStorage.setItem('userDetails', JSON.stringify(userDetailsData));
    }

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
                {editMode.phone_no ? (
                  <input
                    type="tel"
                    defaultValue={userProfile.phone_no || userProfile.phone || ''}
                    onBlur={(e) => handleSave('phone_no', e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{userProfile.phone_no || userProfile.phone || 'Not set'}</span>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit('phone_no')}
                    >
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </div>
            </div>

            {userProfile.id && (
              <div className={styles.fieldGroup}>
                <label>User ID</label>
                <div className={styles.fieldContent}>
                  <span>{userProfile.id}</span>
                </div>
              </div>
            )}

            {userProfile.joinedDate && (
              <div className={styles.fieldGroup}>
                <label>Member Since</label>
                <div className={styles.fieldContent}>
                  <span>{new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
