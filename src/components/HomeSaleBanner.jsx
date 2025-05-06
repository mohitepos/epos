import React from 'react';
import { Row, Col, Card } from 'antd';

// Import images from local assets
import sale1 from '../assets/sale/sale1.png';
import sale2 from '../assets/sale/sale2.png';
import sale3 from '../assets/sale/sale3.png';

const banners = [
  { src: sale1, alt: 'Sale Banner 1' },
  { src: sale2, alt: 'Sale Banner 2' },
  { src: sale3, alt: 'Sale Banner 3' },
];

const HomeSaleBanner = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#fafafa' }}>
      <Row gutter={[16, 16]}>
        {banners.map((banner, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              hoverable
              styles={{ body: { display: 'none' } }} // This removes the default empty body
              cover={
                <img
                  alt={banner.alt}
                  src={banner.src}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              }
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeSaleBanner;
