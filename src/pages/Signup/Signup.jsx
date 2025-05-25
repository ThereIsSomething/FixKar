import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import instance from '../../utils/apiClient';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import {useSignup} from '../../context/SignupContext';
import styles from './Signup.module.css';


const Signup = () => {    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const {setSignupData} = useSignup();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Make API call to send OTP
            console.log('hello');
            const response = await instance.post('/signupotp', {
                email: formData.email
            });

            console.log('OTP sent successfully:', response.data);
            
            // Store signup data in context
            setSignupData(formData);
            
            // Navigate to OTP verification page
            navigate('/otp');
        } catch (error) {
            console.error('Error sending OTP:', error);
            
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || 'Failed to send OTP. Please try again.';
                setErrors({ email: errorMessage });
            } else if (error.request) {
                // Request was made but no response received
                setErrors({ email: 'Unable to connect to server. Please check your internet connection.' });
            } else {
                // Something else happened
                setErrors({ email: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length < 6) return null;
        if (password.length < 8) return {text: 'Weak', color: 'var(--error)'};
        if (password.length < 12) return {text: 'Medium', color: 'var(--warning)'};
        return {text: 'Strong', color: 'var(--success)'};
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join us today and get started</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                        leftIcon="👤"
                        helperText="Your display name"
                    />                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        leftIcon="📧"
                        helperText="We'll send a verification code to this email"
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        required
                        leftIcon="📱"
                        helperText="Your contact number"
                    />                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                        hidePasswordToggle={true}
                        leftIcon="🔒"
                        helperText={passwordStrength ? `Password strength: ${passwordStrength.text}` : "Must be at least 8 characters"}
                    />                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        success={formData.confirmPassword && formData.password === formData.confirmPassword ? "Passwords match!" : null}
                        required
                        hidePasswordToggle={true}
                        leftIcon="🔒"
                        helperText="Re-enter your password"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        loading={loading}
                        disabled={!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword}
                    >
                        {loading ? 'Creating Account...' : 'Continue'}
                    </Button>
                </form>

                <div className={styles.divider}>or</div>

                <div className={styles.loginLink}>
                    <p>Already have an account?</p>
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
