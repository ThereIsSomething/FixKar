import React from 'react';
import styles from './Logo.module.css';
import fixkarLogo from '../../assets/FixKarByVismit.svg';

const Logo = () => (
  <div className={styles.logoContainer}>
    <img src={fixkarLogo} alt="FixKar by Vismit" className={styles.logo} />
  </div>
);

export default Logo;