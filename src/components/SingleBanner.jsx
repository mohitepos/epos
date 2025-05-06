import React from 'react';
import bannerImage from '../assets/gaiabay-summer-sale-banner-2.png';
import { Image } from 'antd';

const SingleBanner = () => {
  return (
    <div style={{ margin: '24px 0' }}>
      <Image
        src={bannerImage}
        alt="Home Banner"
        preview={false}
      />
    </div>
  );
};

export default SingleBanner;
