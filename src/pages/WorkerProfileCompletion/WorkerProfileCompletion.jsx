import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './WorkerProfileCompletion.module.css';

const SKILL_CATEGORIES = ['Electrician', 'Plumber', 'Carpenter', 'Cleaner'];

const WorkerProfileCompletion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    profilePhoto: null,
    idProofPhoto: null,
    skillCategory: '',
    skillDescription: '',
    city: '',
    pincode: '',
    state: ''
  });

  const [previews, setPreviews] = useState({
    profile: '',
    idProof: ''
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const token = "dfac02cd534d4a";
      const response = await axios.get(`https://ipinfo.io/json?token=${token}`);
      
      const locationData = response.data;
      setFormData(prev => ({
        ...prev,
        city: locationData.city || '',
        state: locationData.region || '',
        pincode: locationData.postal || ''
      }));
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Could not detect location automatically. Please fill in manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(`${type === 'profile' ? 'Profile photo' : 'ID proof'} must be less than 5MB`);
        return;
      }

      setFormData(prev => ({
        ...prev,
        [type === 'profile' ? 'profilePhoto' : 'idProofPhoto']: file
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [type]: url
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.profilePhoto) {
      setError('Please upload a profile photo');
      setLoading(false);
      return;
    }

    if (!formData.idProofPhoto) {
      setError('Please upload your government ID proof');
      setLoading(false);
      return;
    }

    if (!formData.skillCategory) {
      setError('Please select your skill category');
      setLoading(false);
      return;
    }

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append('profilePhoto', formData.profilePhoto);
      submitData.append('idProofPhoto', formData.idProofPhoto);
      submitData.append('skillCategory', formData.skillCategory);
      submitData.append('skillDescription', formData.skillDescription);
      submitData.append('city', formData.city);
      submitData.append('pincode', formData.pincode);
      submitData.append('state', formData.state);

      // Mock API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', Object.fromEntries(submitData));

      // Navigate to appropriate page after success
      // navigate('/worker-dashboard');
      
    } catch (err) {
      setError('Failed to submit profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Complete Your Profile</h1>
        <p className={styles.subtitle}>Fill in your details to start accepting jobs</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Profile Photo Upload */}
          <div className={styles.photoUpload}>
            <div className={styles.photoPreview}>
              {previews.profile ? (
                <img src={previews.profile} alt="Profile preview" />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => document.getElementById('profilePhotoInput').click()}
              type="button"
            >
              Upload Profile Photo
            </Button>
            <input
              id="profilePhotoInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'profile')}
              className={styles.hiddenInput}
            />
            <p className={styles.helperText}>Maximum file size: 5MB</p>
          </div>

          {/* ID Proof Photo Upload */}
          <div className={styles.photoUpload}>
            <div className={styles.photoPreview}>
              {previews.idProof ? (
                <img src={previews.idProof} alt="ID proof preview" />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <i className="fas fa-id-card"></i>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => document.getElementById('idProofInput').click()}
              type="button"
            >
              Upload Government ID
            </Button>
            <input
              id="idProofInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'idProof')}
              className={styles.hiddenInput}
            />
            <p className={styles.helperText}>Upload any valid government ID (Maximum file size: 5MB)</p>
          </div>

          {/* Skill Category */}
          <div className={styles.formGroup}>
            <label>Skill Category</label>
            <select
              name="skillCategory"
              value={formData.skillCategory}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select your category</option>
              {SKILL_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Description */}
          <div className={styles.formGroup}>
            <label>Skill Description</label>
            <textarea
              name="skillDescription"
              value={formData.skillDescription}
              onChange={handleChange}
              placeholder="Briefly describe your experience and expertise..."
              className={styles.textarea}
              rows={4}
              required
            />
          </div>

          {/* Location Fields */}
          <div className={styles.locationFields}>
            <Input
              label="City"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={locationLoading}
              required
            />
            <Input
              label="Pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              disabled={locationLoading}
              required
            />
            <Input
              label="State"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={locationLoading}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading || locationLoading}
          >
            {loading ? 'Submitting...' : 'Complete Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WorkerProfileCompletion;
