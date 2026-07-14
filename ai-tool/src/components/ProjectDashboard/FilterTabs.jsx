import React from 'react';

const FilterTabs = ({ activeTab, onTabChange, styles }) => {
  const tabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'inProgress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div style={styles.filterTabs}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          style={{
            ...styles.tabButton,
            ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab)
          }}
          onClick={() => onTabChange(tab.id)}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.target.style.backgroundColor = '#f9fafb';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
