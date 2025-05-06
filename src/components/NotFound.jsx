import React from 'react';
import { Button, Result, Space } from 'antd';
import { Link } from 'react-router-dom'; // Allows linking back to the homepage

const NotFound = () => {
  const buttonStyle = {
    backgroundColor: '#FFB144',
    borderColor: '#FFB144',
    color: '#fff',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Space>
            <Button style={buttonStyle}>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button style={buttonStyle}>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default NotFound;
