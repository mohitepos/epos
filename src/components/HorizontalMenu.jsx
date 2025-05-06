import React from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const HorizontalMenu = () => {
  // Sample categories, replace with your dynamic data
  const categories = [
    'WOMEN', 'MEN', 'KIDS', 'INDIAN ETHNIC WEAR', 'SAVORIES & SNACKS', 
    'JEWELRY & ACCESSORIES', 'BAGS', 'BEAUTY & HEALTH'
  ];

  // Menu Item Render
  const renderMenuItems = () => {
    return categories.map((category, index) => (
      <Col key={index} style={{ padding: '0 15px' }}>
        {/* Use Link instead of <a> for routing in React */}
        <Link to={`/${category.toLowerCase().replace(/\s+/g, '-')}.html`} className="ant-typography"  style={{ color: '#041E25',fontSize:16 }} >
          {category}
        </Link>
      </Col>
    ));
  };

  return (
    // Directly use Row for layout
    <Row gutter={[16, 0]} justify="start" align="middle" style={{ display: 'flex', alignItems: 'center',color:'#A4A4A4' }}>
      {renderMenuItems()}
    </Row>
  );
};

export default HorizontalMenu;
