import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom'; // For navigation between pages

const Category = () => {
  const menuItems = [
    {
      label: <Link to="/">Home</Link>,
      key: 'home',
    },
    {
      label: <Link to="/contact">Contact</Link>,
      key: 'contact',
    },
    {
      label: <Link to="/services">Services</Link>,
      key: 'services',
    },
  ];

  return (
    <Menu mode="horizontal" style={{ borderBottom: 'none', background:'#E3D4BF' }} items={menuItems} />
  );
};

export default Category;
