import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './LoginOTPVerification.module.css';
import apiClient from '../../utils/apiClient';
import { useToken } from '../../context/TokenContext';

const LoginOTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveTokens } = useToken();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from navigation state
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      navigate('/login');
      return;
    }
    setEmail(emailFromState);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, location.state]);

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      // Make API call to verify OTP
      const response = await apiClient.post('/verification', {
        email: email,
        otp: otp
      });
      console.log(response) ;

      if (response.status === 200) {
        // Store user data from backend response
        const userData = response.data;
        
        // Save tokens using TokenContext
        saveTokens(userData.access_token, userData.refresh_token);
        
        // Store other user data
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');

        setLoading(false);
        
        // Role-based redirection
        const userRole = userData.role;
        if (userRole === 'worker') {
          navigate('/worker-dashboard');
        } else if (userRole === 'user') {
          navigate('/dashboard');
        } else {
          // Default fallback
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    
    setLoading(true);
    try {
      // Make API call to resend OTP
      const response = await apiClient.post('/login', {
        email: email
      });

      if (response.status === 200) {
        setTimeLeft(30);
        setLoading(false);
        setError('');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend OTP. Please try again.');
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Verify OTP</h1>
        <p className={styles.subtitle}>
          Enter the verification code sent to {email}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Verification Code"
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleChange}
            error={error}
            required
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </Button>

          <div className={styles.resendSection}>
            <Button
              variant="text"
              onClick={handleResendOTP}
              disabled={timeLeft > 0 || loading}
            >
              {timeLeft > 0
                ? `Resend OTP in ${timeLeft}s`
                : 'Resend OTP'}
            </Button>
          </div>
        </form>

        <div className={styles.formFooter}>
          <Button
            variant="text"
            onClick={() => navigate('/login')}
          >
            ← Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginOTPVerification;