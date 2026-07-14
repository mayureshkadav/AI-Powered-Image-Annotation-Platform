import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Correct relative import

const Sidebar = () => {
  const menuItems = [
    { name: 'Project', path: '/' },
    { name: 'Monitoring', path: '/monitoring' },
    { name: 'Explore', path: '/explore' },
    { name: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // ❌ remove auth
    navigate('/login'); // ⏩ go back to login
  };


  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-item active' : 'sidebar-item'
            }
          >
            {item.name}
          </NavLink>
        ))}
        {/* <button onClick={handleLogout}>Logout</button> */}
      </nav>
    </aside>
  );
};

export default Sidebar;
