import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Logo from '../../components/Logo/Logo';
import styles from './ServiceWorkers.module.css';
import instance from '../../utils/apiClient';
import axios from 'axios';

// Define service categories with their icons and colors
const serviceTypes = [
  { id: 'electrician', label: 'Electrician', color: '#FCE7F3', textColor: '#BE185D' },
  { id: 'plumbing', label: 'Plumbing', color: '#E0F2FE', textColor: '#0369A1' },
  { id: 'cleaning', label: 'Cleaning', color: '#ECFDF5', textColor: '#047857' },
  { id: 'carpenter', label: 'Carpenter', color: '#FEF3C7', textColor: '#B45309' }
];

const ServiceWorkers = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's location from session storage or fetch it
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // First try to get from session storage
        const cachedLocation = sessionStorage.getItem('userLocation');
        if (cachedLocation) {
          const locationData = JSON.parse(cachedLocation);
          if (locationData.city) {
            setUserLocation(locationData);
            return;
          }
        }

        // If no cached location or no city, fetch from IP API
        const token = "dfac02cd534d4a";
        const response = await axios.get(`https://ipinfo.io/json?token=${token}`);
        const locationData = response.data;
        
        if (locationData.city) {
          sessionStorage.setItem('userLocation', JSON.stringify(locationData));
          setUserLocation(locationData);
        } else {
          throw new Error('Could not determine city from IP');
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Unable to determine your location. Please try again or contact support.');
      }
    };

    fetchLocation();
  }, []);

  // Fetch workers data from the backend
  useEffect(() => {
    const fetchWorkers = async () => {
      // Don't fetch if we don't have a city
      if (!userLocation?.city) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await instance.get('/available_workers', {
          params: {
            city: userLocation.city
          }
        });
        
        console.log('Fetched workers data:', response.data);
        console.log('User city:', userLocation.city);
        
        const workersData = Array.isArray(response.data) ? response.data : [];
        setWorkers(workersData);
        
      } catch (err) {
        console.error('Failed to fetch workers:', err);
        if (err.response?.status === 400 && err.response?.data?.error === 'City name is required') {
          setError('Unable to find workers: City location is required. Please refresh the page or contact support.');
        } else {
          setError(
            err.response?.data?.message || 
            'Failed to load workers. Please try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [userLocation]); // Re-fetch when location changes

  const handleChatWorker = (workerId) => {
    navigate(`/chat/${workerId}`);
  };

  const filteredWorkers = selectedService
    ? workers.filter(worker => worker.profession?.toLowerCase() === selectedService.toLowerCase())
    : workers;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>
          {userLocation ? 'Loading available workers...' : 'Detecting your location...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft />
          </button>
          <Logo />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.serviceFilters}>
          {serviceTypes.map(type => (
            <button
              key={type.id}
              className={`${styles.filterButton} ${selectedService === type.id ? styles.active : ''}`}
              onClick={() => setSelectedService(type.id === selectedService ? null : type.id)}
              style={{
                '--background-color': type.color,
                '--text-color': type.textColor
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className={styles.workersList}>
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map(worker => (
              <div key={worker.id} className={styles.workerCard}>
                <div className={styles.workerInfo}>
                  <div className={styles.workerHeader}>
                    <h3>{worker.name}</h3>
                  </div>
                  <p className={styles.profession}>
                    {worker.profession}
                  </p>
                  <p className={styles.location}>
                    <FaMapMarkerAlt /> {worker.location}
                  </p>
                  <div className={styles.stats}>
                    <div className={styles.rating}>
                      <FaStar className={styles.starIcon} />
                      <span>{worker.rating || '0.0'}</span>
                      <span className={styles.ratingCount}>({worker.completedJobs || 0} jobs)</span>
                    </div>
                  </div>
                </div>
                <button 
                  className={styles.hireButton}
                  onClick={() => handleChatWorker(worker.id)}
                >
                  Chat Now
                </button>
              </div>
            ))
          ) : (
            <div className={styles.noWorkersMessage}>
              <p>No workers available{selectedService ? ` for ${selectedService}` : ''}.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceWorkers;
