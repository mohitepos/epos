import React from 'react';
import { Row, Col } from 'antd'; // Import necessary components from Ant Design
import AllCategories from './AllCategories'; // Your AllCategories component
import HorizontalMenu from './HorizontalMenu'; // Your HorizontalMenu component

const CategoryBar = () => {
  return (
    <Row gutter={[16, 0]} justify="space-between"  align="middle" style={{ width: '100%',backgroundColor:'#E3D4BF', padding: '18px 0', margin:'0'   }}>
      {/* AllCategories will stay fixed on the left with a small left margin */}
      <Col style={{ paddingLeft: 40 }}>
        <AllCategories />
      </Col>

      {/* HorizontalMenu will take the remaining space and touch the right side */}
      <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <HorizontalMenu />
      </Col>
    </Row>
  );
};

export default CategoryBar;
