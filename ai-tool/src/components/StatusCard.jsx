import React from 'react';

const StatusCard = ({ icon, bgColor, iconColor, value, title, subtitle }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: bgColor,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { style: { width: '20px', height: '20px', color: iconColor } })}
        </div>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'black' }}>{value}</span>
      </div>
      <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', margin: 0 }}>{subtitle}</p>
    </div>
  );
};

export default StatusCard;
