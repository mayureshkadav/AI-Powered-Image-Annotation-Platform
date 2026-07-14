import React from 'react';

const StatCard = ({ label, value, isActive, onClick, styles }) => (
  <div 
    style={{
      ...styles.statCard,
      ...(isActive ? styles.statCardActive : styles.statCardInactive)
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.target.style.backgroundColor = '#f9fafb';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.target.style.backgroundColor = 'white';
      }
    }}
  >
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

export default StatCard;
