import React, { useState, useEffect } from 'react';
import "../css/App.css";

const CurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      setCurrentDateTime(`${date} ${time}`);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <p className="cool-font-details-md squeal m-0">{currentDateTime}</p>
    </div>
  );
};

export default CurrentDateTime;
