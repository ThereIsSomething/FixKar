
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../utils/apiClient';
import Button from '../../components/Button/Button';
import { useSignup } from '../../context/SignupContext';
import styles from './OTPVerification.module.css';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { signupData, setOtpVerified , clearSignupData } = useSignup();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
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
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      // Step 1: Verify OTP
      const verifyResponse = await instance.post('/signupotp_verify', {
        email: signupData?.email,
        phone_no:signupData?.phone ,
        password:signupData?.password ,
        name:signupData?.name ,
        otp: otpValue
        
      });

      console.log('OTP verification successful:', verifyResponse.data);

      // Step 2: If OTP verification successful (status 200), create the account
      if (verifyResponse.status === 200) {
        // const signupResponse = await apiClient.post('/signup', signupData);
        
        // console.log('Account created successfully:', signupResponse.data);
        
        // Set OTP as verified and navigate to role selection
        setOtpVerified(true);
        navigate('/role',{state:{email:signupData.email}});
        clearSignupData();
      }
    } catch (error) {
      console.error('Error during verification/signup:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 400 || error.response.status === 401) {
          setError('Invalid OTP. Please try again.');
        } else {
          const errorMessage = error.response.data?.message || 'Verification failed. Please try again.';
          setError(errorMessage);
        }
      } else if (error.request) {
        // Request was made but no response received
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
      
      // Clear OTP inputs and focus on first input
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };  const handleResend = async () => {
    try {
      // Make API call to resend OTP
      await instance.post('/signupotp', {
        email: signupData?.email
      });
      
      console.log('OTP resent successfully');
      
      // Reset timer and clear inputs
      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);
      setError('');
      
      // Focus on first input
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.iconWrapper}></div>
          <h1 className={styles.title}>Verify Your Email</h1>
        <p className={styles.subtitle}>
          We've sent a 6-digit verification code to{' '}
          <strong>{signupData?.email || 'your email address'}</strong>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            disabled={otp.join('').length !== 6 || timeLeft === 0}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        <div className={styles.resendSection}>
          <p className={styles.resendText}>Didn't receive the code?</p>
          {timeLeft > 0 ? (
            <div className={styles.timer}>
              Resend code in {formatTime(timeLeft)}
            </div>
          ) : (
            <Button
              variant="outline"
              size="medium"
              onClick={handleResend}
            >
              Resend Code
            </Button>
          )}
        </div>        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/signup')}
        >
          ← Change Email Address
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
