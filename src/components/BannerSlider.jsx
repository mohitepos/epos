import React from 'react';
import { Carousel } from 'antd';

// Import images from src/assets/home
import banner1 from '../assets/home/banner1.png';
import banner2 from '../assets/home/banner2.png';
import banner3 from '../assets/home/banner1.png';

const BannerSlider = () => {
  const images = [banner1, banner2, banner3];

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Carousel autoplay dotPosition="bottom">
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`banner-${index}`}
              style={{
                width: '100%',
                height: '400px', // Adjust to fit your design
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerSlider;
