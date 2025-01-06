import React from 'react';
import '../styles/Profile.css';

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user')); 
    
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.image} alt="Profile" className="profile-image" />
        <h1>{user.name}</h1>
        <p className="job-title">{user.job_title}</p>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <strong>วันเกิด:</strong> <span>{user.birthdate}</span>
        </div>
        <div className="detail-item">
          <strong>อายุ:</strong> <span>{calculateAge(user.birthdate)} ปี</span>
        </div>
        <div className="detail-item">
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div className="detail-item">
          <strong>เบอร์โทร:</strong> <span>{user.phone}</span>
        </div>
        <div className="detail-item">
          <strong>ที่อยู่:</strong> <span>{user.address}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
