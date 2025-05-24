import React, { createContext, useState, useContext, useEffect } from 'react';

const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
  // Initialize from sessionStorage if available
  const [signupData, setSignupDataState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('signupData');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [otpVerified, setOtpVerified] = useState(false);
  const [role, setRole] = useState(null);

  // Keep signupData in sync with sessionStorage
  useEffect(() => {
    if (signupData) {
      sessionStorage.setItem('signupData', JSON.stringify(signupData));
    } else {
      sessionStorage.removeItem('signupData');
    }
  }, [signupData]);

  // Custom setter to clear sessionStorage after OTP verification
  const clearSignupData = () => {
    setSignupDataState(null);
    sessionStorage.removeItem('signupData');
  };

  return (
    <SignupContext.Provider value={{
      signupData,
      setSignupData: setSignupDataState,
      otpVerified,
      setOtpVerified,
      role,
      setRole,
      clearSignupData
    }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => useContext(SignupContext);
