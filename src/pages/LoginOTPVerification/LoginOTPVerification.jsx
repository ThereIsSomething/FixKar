import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './LoginOTPVerification.module.css';

const LoginOTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [loginAttempt, setLoginAttempt] = useState(null);

  useEffect(() => {
    // Get login attempt data from session storage
    const storedAttempt = sessionStorage.getItem('loginAttempt');
    if (!storedAttempt) {
      navigate('/login');
      return;
    }
    setLoginAttempt(JSON.parse(storedAttempt));

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
  }, [navigate]);

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
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real application, verify OTP with backend
      if (otp === loginAttempt.otp) { // This comparison would happen on backend
        // Mock successful login response
        const mockUserData = {
          id: Math.random().toString(36).substr(2, 9),
          email: loginAttempt.email,
          name: 'John Doe', // This would come from backend
          token: 'mock_token_' + Math.random().toString(36).substr(2, 16)
        };

        // Store user data in session storage
        sessionStorage.setItem('userData', JSON.stringify(mockUserData));
        sessionStorage.removeItem('loginAttempt'); // Clean up login attempt data

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    
    setLoading(true);
    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock new OTP response
      const newLoginAttempt = {
        ...loginAttempt,
        otp: "123456", // This would come from backend
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem('loginAttempt', JSON.stringify(newLoginAttempt));
      setLoginAttempt(newLoginAttempt);
      setTimeLeft(30);
      setLoading(false);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      setLoading(false);
    }
  };

  if (!loginAttempt) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Verify OTP</h1>
        <p className={styles.subtitle}>
          Enter the verification code sent to {loginAttempt.email}
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
