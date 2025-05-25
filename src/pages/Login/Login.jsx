import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './Login.module.css';
import instance from '../../utils/apiClient';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      // Make API call to backend for login
      const response = await instance.post('/login', {
        email: email
      });

      // If API call is successful, navigate to OTP verification page
      if (response.status === 200) {
        setLoading(false);
        navigate('/verify-login-otp', { state: { email: email } });
      }
      
    } catch (err) {
      console.error('Error sending login request:', err);
      setError('Failed to send OTP. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            error={error}
            required
            leftIcon="📧"
            helperText="We'll send you a one-time password"
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            {loading ? 'Sending OTP...' : 'Get OTP'}
          </Button>
        </form>

        <div className={styles.formFooter}>
          <p className={styles.signupText}>
            Don't have an account?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/signup')}
              className={styles.signupButton}
            >
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
