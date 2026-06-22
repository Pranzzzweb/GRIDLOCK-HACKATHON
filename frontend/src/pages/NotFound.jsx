import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page container text-center">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary mt-3">Return Home</Link>

      <style>{`
        .not-found-page {
          padding: 100px 20px;
        }

        .not-found-page h1 {
          font-size: 6rem;
          color: var(--primary-color);
          margin-bottom: 0;
        }

        .not-found-page p {
          color: #666;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
