import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


// Example response transformers for different job types
const transformServiceRequest = (job) => ({
  ...job,
  requestedAt: job.createdAt,
  urgency: job.priority || 'Normal',
  serviceType: job.service?.type || 'General'
});

const transformActiveTask = (job) => ({
  ...job,
  startTime: job.startedAt,
  status: job.currentStatus,
  serviceType: job.service?.type || 'General'
});

const transformPastJob = (job) => ({
  ...job,
  completedAt: job.finishedAt,
  rating: job.customerRating,
  serviceType: job.service?.type || 'General'
});

export const fetchJobsByType = async (type) => {
  try {
    const endpoint = getEndpointByType(type);
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    
    // Transform the data based on job type
    const transformData = (data) => {
      switch (type) {
        case 'service-requests':
          return data.map(transformServiceRequest);
        case 'active-tasks':
          return data.map(transformActiveTask);
        case 'past-jobs':
          return data.map(transformPastJob);
        default:
          return data;
      }
    };

    return transformData(response.data);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch jobs. Please try again.'
    );
  }
};

const getEndpointByType = (type) => {
  switch (type) {
    case 'service-requests':
      return '/worker/service-requests';
    case 'active-tasks':
      return '/worker/active-tasks';
    case 'past-jobs':
      return '/worker/completed-jobs';
    default:
      throw new Error('Invalid job type');
  }
};
