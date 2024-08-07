import React from 'react';
import { useUserProfile } from '../UserProfileContext';
import './UserProfile.css';

const UserProfile = () => {
  const { userProfile } = useUserProfile();

  if (!userProfile) {
    return (
      <div className="profile-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-container">
      <div className="profile-title">User Profile</div>
      <div className="profile-header">
        Account created {formatDate(userProfile.date_joined)}
      </div>
      <div className="profile-table">
        <div className="table-header">
          <div>Time</div>
          <div>Best</div>
          <div>Average WPM</div>
          <div>Average Accuracy</div>
          <div>Average Raw WPM</div>
          <div>Tests Taken</div>
        </div>
        <div className="table-row">
          <div>1:00</div>
          <div>{userProfile.highest_wpm || '-'}</div>
          <div>{userProfile.average_wpm ? userProfile.average_wpm.toFixed(0) : '-'}</div>
          <div>{userProfile.average_accuracy ? `${(userProfile.average_accuracy).toFixed(0)}%` : '-'}</div>
          <div>{userProfile.average_raw_wpm ? userProfile.average_raw_wpm.toFixed(0) : '-'}</div>
          <div>{userProfile.tests_taken || '-'}</div>
        </div>
        {/* Kalo mau tambah jenis waktu test di sini */}
      </div>
    </div>
  );
};

export default UserProfile;