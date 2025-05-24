import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className={styles.spinner} />}
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>
    </button>
  );
};

export default Button;
