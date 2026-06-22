import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <FaShieldAlt />
            <span>Ministry of Road Transport & Highways Theme</span>
          </div>
          <p>AI-Powered Traffic Violation Detection Prototype</p>
        </div>
        
        <div className="footer-right">
          <p>&copy; {new Date().getFullYear()} Gridlock Hackathon. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--secondary-color);
          color: #f0f0f0;
          padding: 40px 0 20px;
          margin-top: 60px;
        }

        .footer-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 20px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .footer-left p {
          color: #bbb;
          font-size: 0.9rem;
        }

        .footer-right p {
          font-size: 0.9rem;
          color: #bbb;
        }

        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
