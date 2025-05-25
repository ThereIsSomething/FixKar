

import React, { useState } from 'react';
import style from './RoleSelection.module.css';
import { useSignup } from '../../context/SignupContext';
import { useNavigate,useLocation } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
// import workericon from '../../assets/workericon.svg'; // Uncomment and provide icon if available


const Continue = ({ label, ...props }) => (
  <button type="button" {...props} style={{marginTop: '2rem', padding: '0.8rem 2.5rem', background: '#4F8A8B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'}}>{label}</button>
);

const RoleSelection = ({ onSelect }) => {
  const location = useLocation() ;
  const email = location.state?.email ;
  console.log(email);
  const { setRole } = useSignup();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('user');
  const handleContinue = async () => {
    try {
      // Make API call to backend
      const response = await apiClient.post('/role', {
        email: email,
        role: selected
      });

      // If API call is successful, proceed with navigation
      if (response.status === 200) {
        setRole(selected);
        if (onSelect) onSelect(selected);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      // You can add user-friendly error handling here
      // For example, show a toast notification or alert
      alert('Failed to update role. Please try again.');
    }
  };
  

  return (
    <div className={style.UserSelection}>
      <p className={style.ChooseOne}>Who are you?</p>

      <label className={`${style.SelectionButton} ${selected === "user" ? style.selected : ""}`}>
        <input type="radio" name="role" value="user" checked={selected === "user"} onChange={() => setSelected("user")}
          className={style.radioInput} />
        <div className={`${style.topRightRadio} ${selected === "user" ? style.active : ""}`}>
          {selected === "user" && <i className={`fa-solid fa-check ${style.tick}`}></i>}
        </div>
        <div className={style.content}>
          <i className={`fa-regular fa-user ${style.Icon}`}></i>
          <div className={style.text}>
            <h3>User</h3>
            <p>This role is for people who want to hire a worker or use a service.</p>
          </div>
        </div>
      </label>

      <label className={`${style.SelectionButton} ${selected === "worker" ? style.selected : ""}`}>
        <input type="radio" name="role" value="worker" checked={selected === "worker"} onChange={() => setSelected("worker")}
          className={style.radioInput} />
        <div className={`${style.topRightRadio} ${selected === "worker" ? style.active : ""}`}>
          {selected === "worker" && <i className={`fa-solid fa-check ${style.tick}`}></i>}
        </div>
        <div className={style.content}>
          {/* <img src={workericon} alt="Worker Icon" className={style.WorkerIcon} /> */}
          <i className={`fa-solid fa-users-gear ${style.Icon}`}></i>
          <div className={style.text}>
            <h3>Worker</h3>
            <p>This is someone who will offer services to users.</p>
          </div>
        </div>
      </label>
      <Continue label="Continue" onClick={handleContinue} />
    </div>
  );
};

export default RoleSelection;
