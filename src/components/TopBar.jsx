import React from "react";
import { Layout, Typography, Menu } from "antd";

const { Header } = Layout;
const { Text, Link } = Typography;

const TopBar = () => {
  return (
    <Header
      style={{
        backgroundColor: "#f0f2f5",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 48,
        lineHeight: "48px",
      }}
      className="top-bar"
    >
      {/* Skip to Content */}
      <a
        href="#contentarea"
        className="skip-link"
        style={{
          position: "absolute",
          left: -9999,
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
        onFocus={(e) => {
          e.target.style.left = "10px";
          e.target.style.top = "10px";
          e.target.style.width = "auto";
          e.target.style.height = "auto";
          e.target.style.zIndex = 999;
        }}
        onBlur={(e) => {
          e.target.style.left = "-9999px";
        }}
      >
        <span>Skip to Content</span>
      </a>

      {/* Welcome and Auth Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Text type="secondary">Default welcome msg!</Text>
        <Menu mode="horizontal" selectable={false}>
          <Menu.Item key="signin">
            <a href="https://demo.extension.jajuma.de/customer/account/login/">Sign In</a>
          </Menu.Item>
          <Menu.Item key="create">
            <a href="https://demo.extension.jajuma.de/customer/account/create/">Create an Account</a>
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  );
};

export default TopBar;
