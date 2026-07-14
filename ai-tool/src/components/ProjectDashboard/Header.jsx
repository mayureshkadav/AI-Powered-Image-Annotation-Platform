import React from 'react';

// Search Icon SVG
const SearchIcon = ({ styles }) => (
  <svg style={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Header = ({ searchTerm, onSearchChange, styles }) => (
  <div style={styles.header}>
    <h1 style={styles.title}>Projects</h1>
    <div style={styles.searchContainer}>
      <div style={styles.searchWrapper}>
        <SearchIcon styles={styles} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
          onFocus={(e) => {
            e.target.parentElement.style.borderColor = '#3b82f6';
            e.target.previousElementSibling.style.color = '#3b82f6';
          }}
          onBlur={(e) => {
            e.target.parentElement.style.borderColor = '#d1d5db';
            e.target.previousElementSibling.style.color = '#9ca3af';
          }}
        />
      </div>
    </div>
  </div>
);

export default Header;
