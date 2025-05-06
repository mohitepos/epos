import React, { useState } from "react";
import { Modal, Form, Input, Button, Checkbox, Typography, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const { Link } = Typography;

// Login function that will be called by React Query's mutation
const loginCustomer = async (data) => {
  const payload = {
    username: data.username,
    password: data.password,
  };
  try {
    const response = await axios.post(
      "/api/rest/V1/integration/customer/token",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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
        // Make a request to get customer details using the token
        const customerResponse = await axios.get("/api/rest/V1/customers/me", {
          headers: {
            Authorization: `Bearer ${data}`,
            "Content-Type": "application/json",
          },
        });

        // Save necessary customer info to localStorage
        const customerData = {
          token: data,
          id: customerResponse.data.id,
          email: customerResponse.data.email,
          name: `${customerResponse.data.firstname} ${customerResponse.data.lastname}`,
        };
        localStorage.setItem("customer", JSON.stringify(customerData)); // Save customer name

        notification.success({
          message: "Logged in successfully!",
        });
        onClose(); // Close the modal on success
        navigate("/customer/account"); // Redirect to the customer account page
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

  // Function to handle form submission
  const handleLogin = (values) => {
    mutate(values); // Trigger the mutation with form values
  };

  const handleNavigateToRegister = () => {
    onClose(); // Close the modal
    navigate("/register"); // Navigate to the register page
  };

  return (
    <Modal
      title="Login"
      open={isVisible} // Use open instead of visible
      onCancel={onClose}
      footer={null}
      destroyOnClose={true} // Destroy the modal content when closed
      centered
      width={400} // Custom width for the modal
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
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please input a valid email!" },
          ]}
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
            loading={isLoading} // Ant Design's loading prop is connected to React Query's mutation state
            style={{ backgroundColor: "#CD253A", borderColor: "#CD253A" }}
          >
            {isLoading ? <Spin /> : "Log in"} {/* Show a spinner if loading */}
          </Button>
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: "center" }}>
            <Link onClick={handleNavigateToRegister} style={{ color: "#CD253A" }}>
              Create an account
            </Link>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
