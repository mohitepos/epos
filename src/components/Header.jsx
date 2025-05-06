import { Button, Layout, Space, Typography, Input, notification, Dropdown, Badge } from "antd";
import React, { useState, useEffect } from "react";
import logo from '../assets/logo.png';
import { HeartOutlined, SearchOutlined, UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useCartSummary } from '../hooks/useCartSummary';



const { Header: AntHeader } = Layout;
const { Text, Link: AntLink } = Typography;

const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const customerToken = JSON.parse(localStorage.getItem("customer"));
  const { data, isLoading } = useCartSummary();
  const itemCount = data?.items_count || 0;

  // Inactivity timer state
  let inactivityTimer;

  const showModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  // Logout handler
  const handleLogout = () => {
    try {
      console.log("Logging out due to inactivity...");
      localStorage.clear();
      notification.success({
        message: 'Logged out successfully!',
      });
      navigate("/"); // Or "/login" depending on your routing setup
    } catch (error) {
      console.error('Logout failed:', error);
      notification.error({
        message: 'Logout Failed',
        description: 'There was an issue logging you out. Please try again later.',
      });
    }
  };

  const resetInactivityTimer = () => {
    // Clear any existing timeout
    clearTimeout(inactivityTimer);

    // Set a new timer to log out after 1 hour (3600 seconds)
    inactivityTimer = setTimeout(handleLogout, 1000 * 60 * 60); // 1 hour in milliseconds
  };

  // Setup event listeners to detect user activity
  const setupInactivityListener = () => {
    // List of events that indicate user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    // Add event listeners for user activity
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Start the inactivity timer immediately
    resetInactivityTimer();
  };

  // Ensure inactivity listener is set when the component mounts
  useEffect(() => {
    setupInactivityListener();

    // Cleanup the event listeners when the component unmounts
    return () => {
      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      clearTimeout(inactivityTimer); // Clear the timeout on cleanup
    };
  }, []);

  const items = [
    {
      key: "1",
      label: "My Account",
      onClick: () => navigate("/customer/account"),
    },
    {
      key: "2",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Redirect or call API for search results
    // navigate(`/search?q=${searchQuery}`);
  };

  return (
    <>
      <AntHeader
        style={{
          backgroundColor: "#013835",
          padding: "0 10%",
          height: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: 70, objectFit: 'contain', marginLeft: 20 }} />
          </Link>
        </div>
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearch} // Trigger search on Enter key press
          style={{ width: 400, borderRadius: '22px' }}
          suffix={<SearchOutlined style={{
            backgroundColor: '#FFB144', // Yellow background
            padding: '6px', // Padding inside the circle to space the icon
            borderRadius: '50%', // Make it circular
            fontSize: '18px', // Adjust icon size
            cursor: 'pointer',
          }} onClick={handleSearch} />}
        />
        <Space style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link to="/cart">
          <Badge count={itemCount} size="small" offset={[5, -5]}>
    <Button
      icon={
        <ShoppingCartOutlined
          style={{
            backgroundColor: '#fff',
            padding: '6px',
            color:"#013835",
            borderRadius: '50%',
            fontSize: 24,
            cursor: 'pointer',
          }}
        />
      }
      type="text"
      style={{ fontSize: 24 }}
    />
  </Badge>
          </Link>
          <Button icon={<HeartOutlined style={{
            backgroundColor: '#fff',
            padding: '6px',
            borderRadius: '50%',
            color:"#013835",
            fontSize: 24,
            cursor: 'pointer',
          }} />} type="text" style={{ fontSize: 24 }} />

          {customerToken ?
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={e => e.preventDefault()}>
                <UserOutlined style={{
                  fontSize: 24, cursor: "pointer", color: "#cd253a"
                }} />
              </a>
            </Dropdown> :
            <Button
              onClick={showModal}
              style={{
                borderRadius: "20px",
                backgroundColor: "#FFCD00", 
                color: "#001312", 
                fontSize: 16,
                fontWeight: 600,
                border: "none",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
                cursor: "pointer",
              }}
            >
              Login
            </Button>
          }
        </Space>
      </AntHeader>
      <LoginModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Header;
