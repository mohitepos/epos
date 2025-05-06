import React, { useEffect, useState } from 'react';
import useCategories from '../hooks/useCategories';
import { Card, Row, Col, Avatar, Spin } from 'antd'; // Using Ant Design's Card, Row, Col components for layout

// You can import images from src/assets/Category folder
import DefaultImg from '../assets/Category/Kid.png'; // Example static image for Bags & Luggage
import Men from '../assets/Category/Men.png'; // Example static image for Bags & Luggage
import Women from '../assets/Category/Women.png'; // Example static image for Bags & Luggage
import HomeKitchen from '../assets/Category/home-kitchen.png'; // Example static image for Bags & Luggage
import indian_ethnic from '../assets/Category/indian_ethnic.png'
import Jewelry from '../assets/Category/Jewelry.png'
import household from '../assets/Category/household.png'
import Beauty from '../assets/Category/Beauty.png'
 
const HomeCategory = () => {
    const { data, isError, isLoading } = useCategories();
    const [categories, setCategories] = useState([]);

    // Static image mapping based on category name (import images from src)
    const categoriesImages = {
        "Women's": Women,
        "Men’s": Men,
        "Dairy, Eggs & Chilled": DefaultImg,
        "Dietary": DefaultImg,
        "Health & Household": household,
        "Beauty & Health": Beauty,
        "Baby & Maternity": DefaultImg,
        "Jewelry & Accessories": Jewelry,
        "Ethnic Wear": indian_ethnic,
        "Home & Kitchen":HomeKitchen,
        "Bags & Luggage": DefaultImg,
        "Kids wear":DefaultImg,
        // Add more categories and images as needed
    };

    useEffect(() => {
        if (data?.children_data) {
            const parentCategory = data.children_data.filter((cat) => cat.is_active);
            setCategories(parentCategory);
        }
    }, [data]);

    if (isError) {
        return <div>Error loading categories.</div>;
    }
    if (isLoading) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }

    // Function to chunk categories into groups of 6
    const chunkCategories = (categories, chunkSize) => {
        const result = [];
        for (let i = 0; i < categories.length; i += chunkSize) {
            result.push(categories.slice(i, i + chunkSize));
        }
        return result;
    };

    // Group categories into chunks of 6
    const categoryChunks = chunkCategories(categories, 6);

    return (
        <div style={{ padding: '20px' }}>
            {categoryChunks.map((chunk, index) => (
                <div key={index}>
                    <Row gutter={16}>
                        {/* Display 6 items per row */}
                        {chunk.map((cat) => (
                            <Col span={4} key={cat.id}>
                                <Card>
                                    {/* Layout: Image in circle above category name */}
                                    <Row gutter={16} justify="center" align="middle" direction="vertical">
                                        <Col span={24} style={{ textAlign: 'center' }}>
                                            {/* Circular image */}
                                            <Avatar
                                                size={100} // Adjust the size as needed
                                                src={categoriesImages[cat.name] || DefaultImg} // Fallback to default image if no category image
                                                alt={cat.name}
                                                style={{
                                                    borderRadius: '50%', // Ensure the image is circular
                                                    border: '2px solid #fff', // Optional: Add border if you want it to stand out more
                                                }}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            {/* Category name below the image */}
                                            <Card.Meta
                                                title={
                                                    <div
                                                        style={{
                                                            wordWrap: 'break-word',
                                                            whiteSpace: 'normal',
                                                            textAlign: 'center',
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </div>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    );
};

export default HomeCategory;
