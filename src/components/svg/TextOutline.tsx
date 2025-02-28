import React from 'react';

interface TextOutlineProps {
  text?: string;
  strokeColor?: string;  
  strokeWidth?: string;
  shadowColor?: string;
  fillColor?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  letterSpacing?: string;
}

// This was the only way I could perfectly replicate the texts in the figma design, but it seems a bit excessive...

const TextOutline: React.FC<TextOutlineProps> = ({
  text = "Placeholder",
  strokeColor = "#2A3213",
  strokeWidth = "2",
  shadowColor = "#444D29",
  fillColor = "#FFF",
  fontFamily = "Quantico",
  fontSize = "36px",
  fontWeight = "700",
  letterSpacing = "-1.44px",
}) => {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="text-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset in="SourceAlpha" dx="0" dy="2" result="offset" />
          <feFlood floodColor={shadowColor} result="flood" />
          <feComposite in="flood" in2="offset" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontStyle="normal"
        fontWeight={fontWeight}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        letterSpacing={letterSpacing}
        filter="url(#text-shadow)"
      >
        {text}
      </text>
    </svg>
  );
};

export default TextOutline;
