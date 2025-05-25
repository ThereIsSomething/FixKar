import React from 'react';
import { MdLocationOn, MdAccessTime, MdPriorityHigh } from 'react-icons/md';
import { FaCalendarAlt, FaExclamationCircle, FaStar, FaCheckCircle } from 'react-icons/fa';
import styles from './JobList.module.css';

const getJobTypeSpecificDetails = (job, type) => {
  switch (type) {
    case 'service-requests':
      return (
        <>
          <div className={styles.detailItem}>
            <MdAccessTime className={styles.icon} />
            <span>Requested: {new Date(job.requestedAt).toLocaleString()}</span>
          </div>
          <div className={styles.detailItem}>
            <MdPriorityHigh className={`${styles.icon} ${job.urgency === 'High' ? styles.urgent : ''}`} />
            <span>Urgency: {job.urgency}</span>
          </div>
        </>
      );
    case 'active-tasks':
      return (
        <>
          <div className={styles.detailItem}>
            <MdAccessTime className={styles.icon} />
            <span>Started: {new Date(job.startTime).toLocaleString()}</span>
          </div>
          <div className={styles.detailItem}>
            <FaCheckCircle className={`${styles.icon} ${styles.status}`} />
            <span>Status: {job.status}</span>
          </div>
        </>
      );
    case 'past-jobs':
      return (
        <>
          <div className={styles.detailItem}>
            <MdAccessTime className={styles.icon} />
            <span>Completed: {new Date(job.completedAt).toLocaleString()}</span>
          </div>
          <div className={styles.detailItem}>
            <FaStar className={`${styles.icon} ${styles.rating}`} />
            <span>Rating: {job.rating ? `${job.rating}/5` : 'Not rated'}</span>
          </div>
        </>
      );
    default:
      return null;
  }
};

const getEmptyStateMessage = (type) => {
  switch (type) {
    case 'service-requests':
      return 'No new service requests at the moment';
    case 'active-tasks':
      return 'No active tasks currently';
    case 'past-jobs':
      return 'No completed jobs to display';
    default:
      return 'No jobs found';
  }
};

const JobCard = ({ job, type }) => (
  <div className={styles.jobCard}>
    <div className={styles.jobHeader}>
      <h3 className={styles.userName}>{job.userName}</h3>
      <span className={styles.jobType}>{job.serviceType}</span>
    </div>
    <div className={styles.jobDetails}>
      <div className={styles.detailItem}>
        <MdLocationOn className={styles.icon} />
        <span>{job.location}</span>
      </div>
      {getJobTypeSpecificDetails(job, type)}
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loader} />
    <p>Loading...</p>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className={styles.errorContainer}>
    <FaExclamationCircle className={styles.errorIcon} />
    <p>{message}</p>
    <button 
      className={styles.retryButton} 
      onClick={onRetry}
      aria-label="Retry loading jobs"
    >
      Try Again
    </button>
  </div>
);

const EmptyState = ({ title }) => (
  <div className={styles.emptyState}>
    <p>No {title.toLowerCase()} found</p>
  </div>
);

const JobList = ({ title, jobs, loading, error, onRetry, type }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{jobs?.length || 0} items</span>
      </header>
      
      <div className={styles.jobList}>
        {jobs?.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} type={type} />
          ))
        ) : (
          <EmptyState message={getEmptyStateMessage(type)} />
        )}
      </div>
    </div>
  );
};

export default JobList;
