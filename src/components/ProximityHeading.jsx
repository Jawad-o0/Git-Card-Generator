import React, { useRef } from 'react';
import VariableProximity from '../VariableProximity';

const ProximityHeading = ({
  text,
  variant = "subheading",
  fontSize,
  radius = 180,
  falloff = "exponential",
  className = "",
  style = {},
  as: Tag = "h2",
  ...rest
}) => {
  const containerRef = useRef(null);
  const variantClass = {
    heading: "vp-heading",
    subheading: "vp-subheading",
    accent: "vp-accent"
  }[variant] || "vp-subheading";

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
      <Tag className="sr-only">{text}</Tag>
      <VariableProximity
        label={text}
        className={`${variantClass} ${className}`}
        fromFontVariationSettings="'wght' 500"
        toFontVariationSettings="'wght' 1000"
        containerRef={containerRef}
        radius={radius}
        falloff={falloff}
        style={{ fontSize, ...style }}
        aria-hidden="true"
        {...rest}
      />
    </div>
  );
};

export default ProximityHeading;
