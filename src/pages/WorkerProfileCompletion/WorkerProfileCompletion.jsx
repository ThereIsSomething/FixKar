import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import instance from '../../utils/apiClient';
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
    skillCategory: '',
    skillDescription: '',
    city: '',
    pincode: '',
    state: ''
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
    if (!formData.skillCategory) {
      setError('Please select your skill category');
      setLoading(false);
      return;
    }

    if (!formData.skillDescription.trim()) {
      setError('Please provide a skill description');
      setLoading(false);
      return;
    }

    try {
      // Create JSON object for submission (no files)
      const submitData = {
        skill_name: formData.skillCategory,
        skill_description: formData.skillDescription,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      console.log('Submitting worker profile data:');
      console.log('Skill name:', formData.skillCategory);
      console.log('Skill description:', formData.skillDescription);
      console.log('City:', formData.city);
      console.log('State:', formData.state);
      console.log('Pincode:', formData.pincode);

      // Make API call to backend with JSON data
      const response = await instance.post('/worker/upload_documents', submitData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Worker profile submission response:', response.data);

      // Navigate to worker dashboard after successful submission
      navigate('/worker-dashboard');
      
    } catch (err) {
      console.error('Failed to submit worker profile:', err);
      
      // Detailed error logging for debugging
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
        console.error('Error data:', err.response.data);
        
        if (err.response.data && err.response.data.message) {
          setError(`Backend Error: ${err.response.data.message}`);
        } else {
          setError(`HTTP ${err.response.status}: Failed to submit profile`);
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Request setup error:', err.message);
        setError('Request failed. Please try again.');
      }
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
