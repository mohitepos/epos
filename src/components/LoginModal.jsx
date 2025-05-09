// src/components/LoginModal.jsx
import React from "react";
import { Modal, Form, Input, Button, Checkbox, Typography, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../utils/axios"; // Import the custom Axios instance

const { Link } = Typography;

// Login function that will be called by React Query's mutation
const loginCustomer = async (data) => {
  const payload = {
    username: data.username,
    password: data.password,
  };

  try {
    const response = await apiClient.post(
      "/rest/V1/integration/customer/token",  // Use the custom Axios instance with the base URL
      payload
    );
    return response.data; // Token is returned here
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred during login.");
  }
};

const LoginModal = ({ isVisible, onClose }) => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation({
    mutationFn: loginCustomer,
    onSuccess: async (data) => {
      try {
        const customerResponse = await apiClient.get("/rest/V1/customers/me", {
          headers: {
            Authorization: `Bearer ${data}`,
          },
        });

        const customerData = {
          token: data,
          id: customerResponse.data.id,
          email: customerResponse.data.email,
          name: `${customerResponse.data.firstname} ${customerResponse.data.lastname}`,
        };
        localStorage.setItem("customer", JSON.stringify(customerData));

        notification.success({
          message: "Logged in successfully!",
        });
        onClose();
        navigate("/");
      } catch (error) {
        notification.error({
          message: "Failed to fetch customer details",
          description: error?.message || "An error occurred while fetching customer details.",
        });
      }
    },
    onError: (error) => {
      const errorMessage = error?.message || "Login failed. Please check your credentials.";
      notification.error({
        message: "Login failed",
        description: errorMessage,
      });
    },
  });

  const handleLogin = (values) => {
    mutate(values); // Trigger the mutation with form values
  };

  const handleNavigateToRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <Modal
      title="Login"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
      centered
      width={400}
    >
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          label="Email"
          name="username"
          rules={[{ required: true, message: "Please input your email!" }, { type: "email", message: "Please input a valid email!" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            style={{ backgroundColor: "#FFB144", borderColor: "#FFB144", color: "#000", fontWeight: "500" }}
          >
            {isLoading ? <Spin /> : "Log in"}
          </Button>
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: "center" }}>
            <Link onClick={handleNavigateToRegister} style={{ color: "#000", fontWeight: "500" }}>
              Create an account
            </Link>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
  