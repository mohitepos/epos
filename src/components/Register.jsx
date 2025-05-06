import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the Toastify CSS


// Mutation function to register the customer
const registerCustomer = async (data) => {
  const payload = {
    customer: {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
    },
    password: data.password,
  };

  const response = await axios.post(
    "/api/rest/V1/customers", // via Vite proxy, token handled in vite.config.js
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const Register = () => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: registerCustomer,
    onSuccess: async (_, variables) => {
      toast.success('Account created successfully!');
      console.log("Account created successfully!");
    
      try {
        // 1. Login immediately to get token
        const loginResponse = await axios.post('/api/rest/V1/integration/customer/token', {
          username: variables.email,
          password: variables.password,
        });
    
        const token = loginResponse.data;
        localStorage.setItem('customerToken', token);
    
        // 2. Create quote ID for the new customer
        const quoteResponse = await axios.post('/api/rest/V1/carts/mine', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        const quoteId = quoteResponse.data.id || quoteResponse.data;
        // localStorage.setItem('quoteId', quoteId);
        console.log('Quote ID created after registration:', quoteId);
    
        // Redirect to login (or dashboard)
        navigate("/login");
    
      } catch (error) {
        console.error('Login or quote creation failed:', error);
        message.error('Something went wrong after registration. Please log in manually.');
        navigate("/login"); // Fallback redirect
      }
    },    
    onError: (error) => {
      console.error("Registration error:", error);

      if (error.response?.data?.message?.includes("already exists")) {
        message.error("Email already registered.");
      } else {
        message.error("Registration failed. Please try again.");
      }
    },
  });

  const handleRegister = (values) => {
    mutate(values);
  };

  return (
    <div style={{ width: 400, margin: "0 auto", padding: "20px" }}>
      <h2>Create a New Account</h2>
      <Form
        name="register"
        onFinish={handleRegister}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          label="First Name"
          name="firstname"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input placeholder="Enter your first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastname"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input placeholder="Enter your last name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
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

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            style={{ backgroundColor: "#CD253A", borderColor: "#CD253A" }}
          >
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Button
              type="link"
              onClick={() => navigate("/login")}
              style={{ padding: 0, color: "#CD253A" }}
            >
              Login here
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
