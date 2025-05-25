import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing/Landing';
import Signup from '../pages/Signup/Signup';
import OTPVerification from '../pages/OTPVerification/OTPVerification';
import LoginOTPVerification from '../pages/LoginOTPVerification/LoginOTPVerification';
import RoleSelection from '../pages/RoleSelection/RoleSelection';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import UserProfile from '../pages/UserProfile/UserProfile';
import WorkerDashboard from '../pages/WorkerDashboard/WorkerDashboard';
import WorkerProfile from '../pages/WorkerProfile/WorkerProfile';
import { SignupProvider, useSignup } from '../context/SignupContext';
import { TokenProvider } from '../context/TokenContext';
import { useAxiosInterceptors } from '../hooks/useAxiosInterceptors';
import WorkerProfileCompletion from '../pages/WorkerProfileCompletion/WorkerProfileCompletion';

const SignupRoutes = () => {
  const { signupData, setSignupData, otpVerified, setOtpVerified, setRole } = useSignup();
  
  
  useAxiosInterceptors();
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTPVerification />} />
      <Route path="/verify-login-otp" element={<LoginOTPVerification />} />
      <Route path="/role" element={
        otpVerified ? (
          <RoleSelection />
        ) : <Navigate to="/signup" />
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/worker-dashboard" element={<WorkerDashboard />} />
      <Route path="/workerprofile" element={<WorkerProfile />} />
      <Route path="/p" element={<WorkerProfileCompletion />} />
    </Routes>
  );
};

const AppRoutes = () => (
  <Router>
    <TokenProvider>
      <SignupProvider>
        <SignupRoutes />
      </SignupProvider>
    </TokenProvider>
  </Router>
);

export default AppRoutes;
