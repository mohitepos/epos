import React, { useState } from 'react';
import { Layout, Row, Col, Input, Button, Typography, Space, Image, message } from 'antd';
import { MailOutlined, FacebookOutlined, InstagramOutlined, LinkedinFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const { Footer } = Layout;
const { Title, Text } = Typography;
const linkStyle = {
    color: '#fff',
    fontSize: 14,
    fontWeight: 100,
};

const AppFooter = () => {
    const [email,setEmail] = useState('');

    const {mutate, isLoading, isError, isSuccess, error } = useMutation({
        mutationFn:async (email)=>{
            const response = await axios.post('api/rest/all/V1/subscriber',{
                subscriber:{
                    subscriber_email:email
                }
            })
            return response.data;
        },
        onSuccess:()=>{
            message.success('Subscription Successfully!.')
            setEmail('');
        },
        onError:(error)=>{
            message.error(`Error: ${error.response?.data?.message || 'An error occurred'}`);
        }
    })

    const handleSubscribe = () =>{
        console.warn("email:- ",email);
         if (!email) {
            message.error('Please enter a valid email.');
            return;
        }
        mutate(email)
    }
    return (
        <Footer style={{ backgroundColor: '#041E25', color: '#fff', padding: '40px 60px' }}>
            <Row gutter={32}>
                {/* Newsletter - 60% */}
                <Col xs={24} md={14}>
                    <Text style={{ color: '#fff', display: 'block', marginBottom: 8 }}>
                        <MailOutlined style={{ marginRight: 5 }} /> support@gaiabay.com
                    </Text>
                    <Text style={{ color: '#fff', display: 'block', marginBottom: 8 }}>
                        <MailOutlined style={{ marginRight: 5 }} /> sales@gaiabay.com
                    </Text>
                    <Title level={4} style={{ color: '#fff' }}>Subscribe to our Newsletter</Title>
                    <Space direction="vertical" size="middle" style={{ marginTop: '16px' }}>
                        <Input
                            placeholder="Email"
                            style={{
                                width: 300,
                                borderRadius: '50px',
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            suffix={
                                <Button
                                    type="primary"
                                    onClick={handleSubscribe}
                                    style={{
                                        borderRadius: '50px',
                                        borderLeft: 'none',
                                        backgroundColor: '#FFB144',
                                        color: '#000',
                                        fontWeight: '600',
                                    }}
                                >
                                    Subscribe
                                </Button>
                            }
                        />

                        {/* Payment Methods - Image */}
                        <Image
                            preview={false}
                            src="/epos/assets/home/payment_logo.png"
                            alt="Payment Methods"
                            style={{ width: '60%', margin: '8px 10px' }}
                        />

                        {/* Two Images side by side (DMCA and Comodo Secure) */}
                        <Row gutter={16}>
                            <Col span={3}>
                                <Image
                                    preview={false}
                                    src="/epos/assets/home/Dmca.png"
                                    alt="DMCA"
                                    style={{ width: '100%', margin: '8px 10px' }}
                                />
                            </Col>
                            <Col span={6}>
                                <Image
                                    preview={false}
                                    src="/epos/assets/home/comodo_secure.png"
                                    alt="Comodo Secure"
                                    style={{ width: '40%', margin: '8px 10px' }}
                                />
                            </Col>
                        </Row>

                        <Space direction="vertical" size={8}>
                            <Space style={{ gap: '22px' }}>
                                <Text type="secondary" style={{ fontSize: 14, color: '#fff' }}>
                                    Copyright © 2024
                                </Text>
                                <Link href="https://www.GaiaBay.com" target="_blank" style={{ color: '#fff' }}>
                                    www.GaiaBay.com
                                </Link>
                            </Space>
                        </Space>
                    </Space>
                </Col>

                {/* Quick Links - 25% */}
                <Col xs={24} md={5}>
                    <Title level={5} style={{ color: '#fff' }}>Quick Links</Title>
                    <Space direction="vertical" size={8}>
                        <Link href="/about" style={linkStyle}>
                            About Us
                        </Link>
                        <Link href="/contact" style={linkStyle}>
                            Contact
                        </Link>
                        <Link href="/faq" style={linkStyle}>
                            FAQ
                        </Link>
                        <Link href="/delivery-shipping" style={linkStyle}>
                            Delivery & Shipping
                        </Link>
                        <Link href="/privacy-policy" style={linkStyle}>
                            Privacy Policy
                        </Link>
                        <Link href="/return-policy" style={linkStyle}>
                            Return Policy
                        </Link>
                        <Link href="/terms-conditions" style={linkStyle}>
                            Terms & Conditions
                        </Link>
                    </Space>
                    <Title level={5} style={{ color: '#fff', marginTop: '16px' }}>Special Request</Title>
                    <Space direction="vertical" size={8}>
                        <Link href="/about" style={linkStyle}>
                            Partnership Request
                        </Link>
                        <Link href="/about" style={linkStyle}>
                            Bulk Purchase Request
                        </Link>
                        <Link href="/about" style={linkStyle}>
                            Customer Feedback
                        </Link>
                    </Space>
                </Col>

                {/* Download App & Follow Us - 20% */}
                <Col xs={24} md={5}>
                    <Space direction="vertical">
                        <Title level={5} style={{ color: '#fff' }}>Download App</Title>

                        {/* App Store Image */}
                        <Link to="https://apps.apple.com" target="_blank">
                            <Image
                                src="/epos/assets/home/AppStore.png"
                                alt="App Store"
                                style={{ width: '150px', marginBottom: '8px', marginTop: '16px' }}
                                preview={false}
                            />
                        </Link>

                        {/* Google Play Image with marginTop */}
                        <Link to="https://play.google.com/store" target="_blank">
                            <Image
                                src="/epos/assets/home/GooglePlayStore.png"
                                alt="Google Play"
                                style={{ width: '150px', marginTop: '8px' }}
                                preview={false}
                            />
                        </Link>

                        {/* Follow Us Section */}
                        <h3 style={{ color: '#fff', fontSize: '16px', marginTop: '24px' }}>Follow Us</h3>
                        <Space>
                            <Link to="https://www.facebook.com" target="_blank">
                                <FacebookOutlined
                                    style={{
                                        fontSize: '16px',
                                        color: '#041E25',
                                        backgroundColor: '#FFB144',
                                        padding: '6px',
                                        borderRadius: '50%',
                                        display: 'inline-block'
                                    }}
                                />
                            </Link>
                            <Link to="https://www.instagram.com" target="_blank">
                                <InstagramOutlined
                                    style={{
                                        fontSize: '16px',
                                        color: '#041E25',
                                        backgroundColor: '#FFB144',
                                        padding: '6px',
                                        borderRadius: '50%',
                                        display: 'inline-block'
                                    }}
                                />
                            </Link>
                            <Link to="https://www.linkedin.com" target="_blank">
                                <LinkedinFilled
                                    style={{
                                        fontSize: '16px',
                                        color: '#041E25',
                                        backgroundColor: '#FFB144',
                                        padding: '6px',
                                        borderRadius: '50%',
                                        display: 'inline-block'
                                    }}
                                />
                            </Link>
                        </Space>
                    </Space>
                </Col>
            </Row>
        </Footer>
    );
};

export default AppFooter;
