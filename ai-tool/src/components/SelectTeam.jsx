import React from 'react';
import './SelectTeam.css'; // External CSS

const SelectTeam = () => {
  return (
    <div className="assign-container">
      <h2>Assign Images to Team Members</h2>

      <div className="assign-top">
        <label>Total Images to Assign</label>
        <div className="slider-container">
          <input type="range" min="1" max="1" value="1" readOnly />
          <input type="text" value="1" readOnly />
        </div>
        <div className="checkbox-container">
          <input type="checkbox" id="shuffle" />
          <label htmlFor="shuffle">Shuffle images when assigning</label>
        </div>
      </div>

      <div className="assign-buttons">
        <button className="outline-btn">Add Instructions</button>
        <button className="outline-btn">Add Team Members</button>
      </div>

      <input
        type="text"
        placeholder="Search for team members..."
        className="search-input"
      />

      <div className="team-member assigned">
        <img
          src="https://via.placeholder.com/32"
          alt="avatar"
          className="avatar"
        />
        <span className="name">Mayuresh Kadav</span>
        <span className="image-count">100 image</span>
      </div>

      <div className="team-member invited">
        <div className="avatar email-avatar">m</div>
        <span className="name">xyz@gmail.com</span>
        <span className="invited-label">Invited</span>
      </div>

      <div className="action-buttons">
        <button className="start-btn">Start Labeling</button>
      </div>
    </div>
  );
};

export default SelectTeam;
