import React from 'react';

const SectionDivider = ({ className = "" }) => (
  <div className={`w-full flex justify-center py-2 ${className}`} aria-hidden="true">
    <div className="section-divider" />
  </div>
);

export default SectionDivider;
