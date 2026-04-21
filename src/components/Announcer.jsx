import React from 'react';

const Announcer = ({ message, type = 'polite' }) => {
  if (!message) return null;
  return (
    <div
      role={type === 'assertive' ? 'alert' : 'status'}
      aria-live={type}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

export default Announcer;
