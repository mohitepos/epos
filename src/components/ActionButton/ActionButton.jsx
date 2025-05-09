// src/components/ActionButton/ActionButton.jsx

import React, { useState } from 'react';
import { Button } from 'antd';

const ActionButton = ({
  onClick,
  text,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <Button
      type="primary"
      size="large"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: isHovered ? '#fff' : '#FFB144',  // White on hover
        borderColor: '#FFB144',
        borderRadius: '30px',
        color: '#000',
        minWidth: '160px',
        fontWeight: 600,
        fontSize: '16px',
        padding: '14px 20px',
        lineHeight: 'normal',
        marginRight: 16, // Margin between buttons (optional)
      }}
    >
      {text}
    </Button>
  );
};

export default ActionButton;
