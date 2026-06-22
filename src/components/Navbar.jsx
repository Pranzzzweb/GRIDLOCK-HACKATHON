import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHelmetSafety } from 'react-icons/fa6';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <FaHelmetSafety className="logo-icon" />
          <span>TrafficSense AI</span>
        </Link>
        
        <ul className="navbar-links">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/analyze" className={isActive('/analyze')}>Analyze</Link></li>
          <li><Link to="/analytics" className={isActive('/analytics')}>Analytics</Link></li>
          <li><Link to="/history" className={isActive('/history')}>History</Link></li>
          <li><Link to="/about" className={isActive('/about')}>About</Link></li>
          <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
        </ul>
      </div>

      <style>{`
        .navbar {
          background-color: var(--primary-color);
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .logo-icon {
          font-size: 1.8rem;
          color: var(--accent-color);
        }

        .navbar-links {
          display: flex;
          gap: 24px;
        }

        .navbar-links a {
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .navbar-links a:hover {
          background-color: var(--secondary-color);
        }

        .navbar-links a.active {
          background-color: var(--secondary-color);
          border-bottom: 3px solid var(--accent-color);
        }

        @media (max-width: 768px) {
          .navbar-links {
            display: none; /* Basic mobile approach, could add hamburger */
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
