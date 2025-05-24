
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (otpValue === '123456') { // Mock verification
        setOtpVerified(true);
        navigate('/role');
        clearSignupData();
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 2000);
  };
  const handleResend = () => {
    setTimeLeft(300);
    setOtp(['', '', '', '', '', '']);
    setError('');
    console.log('Resending OTP to email:', signupData?.email);
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
