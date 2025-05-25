import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import JobList from '../components/JobList';
import { fetchJobsByType } from '../../../services/jobService';
import styles from './JobListPage.module.css';

const JobListPage = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTitle = () => {
    switch (type) {
      case 'service-requests':
        return 'Service Requests';
      case 'active-tasks':
        return 'Active Tasks';
      case 'past-jobs':
        return 'Past Jobs';
      default:
        return 'Jobs';
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobsData = await fetchJobsByType(type);
        setJobs(jobsData);
      } catch (err) {
        setError(err.message || 'Failed to load jobs. Please try again.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchJobs();
    }

    // Cleanup function to avoid state updates on unmounted component
    return () => {
      setJobs([]);
      setError(null);
    };
  }, [type]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchJobsByType(type)
      .then(jobsData => {
        setJobs(jobsData);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Failed to load jobs. Please try again.');
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/worker-dashboard')}
          aria-label="Back to dashboard"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </header>

      <JobList
        title={getTitle()}
        jobs={jobs}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default JobListPage;
