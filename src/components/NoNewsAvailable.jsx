import React from 'react';
import './NoNewsAvailable.css'; // Import the CSS file

const NoNewsAvailable = ({ message }) => {
  return (
    <div className="no-news-container">
      <div className="no-news-content">
        <img
          src="/sysadmin_03.jpg" // Make sure to add an SVG image or an appropriate path
          alt="No news available" 
          className="no-news-image"
        />
        <h2>{message || 'No News Available'}</h2>
        <p>Stay tuned, we will update this section soon with the latest news!</p>
      </div>
    </div>
  );
};

export default NoNewsAvailable;
