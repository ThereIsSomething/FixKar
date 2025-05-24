import React, { useState } from 'react';
import styles from './Input.module.css';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  success,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  hidePasswordToggle = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Build container classes
  const containerClasses = [
    styles.container,
    fullWidth ? styles.fullWidth : '',
    error ? styles.error : '',
    success ? styles.success : '',
    disabled ? styles.disabled : '',
    focused ? styles.focused : '',
    className
  ].filter(Boolean).join(' ');

  // Build input classes
  const inputClasses = [
    styles.input,
    leftIcon ? styles.withIcon : '',
    (rightIcon || (type === 'password' && !hidePasswordToggle)) ? styles.withRightIcon : ''
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <div className={styles.leftIcon}>
            {leftIcon}
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {type === 'password' && !hidePasswordToggle && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁' : '✱'}
          </button>
        )}
        
        {rightIcon && type !== 'password' && (
          <div className={styles.rightIcon}>
            {rightIcon}
          </div>
        )}
      </div>
      
      <div className={styles.feedback}>
        {error && <div className={styles.errorText}>{error}</div>}
        {success && <div className={styles.successText}>{success}</div>}
        {helperText && !error && !success && (
          <div className={styles.helperText}>{helperText}</div>
        )}
      </div>
    </div>
  );
};

export default Input;
