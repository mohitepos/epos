import React, { useEffect, useState } from 'react';
import useProduct from '../hooks/useProduct';
import { Card, Row, Col, Spin, Alert, Space } from 'antd';
import { Link } from 'react-router-dom';
import { EyeOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import useAddToCart from '../hooks/useAddToCart';

const { Meta } = Card;

const HomeProducts = () => {
    const { data, isError, isLoading } = useProduct();
    const [products, setProducts] = useState([]);
    const { mutate: addToCart } = useAddToCart();

    const [hoveredProductId, setHoveredProductId] = useState(null);
    const [loadingProductId, setLoadingProductId] = useState(null); // Track loading state per product

    const handleMouseEnter = (id) => setHoveredProductId(id);
    const handleMouseLeave = () => setHoveredProductId(null);

    const handleAddToCart = (product) => {
        const cartItem = {
            sku: product.sku,
            qty: 1
        };

        setLoadingProductId(product.id);
        addToCart(cartItem, {
            onSettled: () => setLoadingProductId(null),
            onSuccess: () => {
                console.log("Added to cart:", product);
            },
            onError: (error) => {
                console.error("Error adding to cart:", error);
            }
        });
    };

    useEffect(() => {
        if (data && data.items) {
            setProducts(data.items);
        }
    }, [data]);

    if (isLoading) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }

    if (isError) {
        return <Alert message="Error loading products" type="error" />;
    }

    return (
        <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Apparel</h2>
                <a href="/apparel" style={{ color: '#041E25', fontWeight: '600', textDecoration: 'underline' }}>
                    View All
                </a>
            </div>

            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <Row gutter={[16, 24]} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {products.length > 0 ? (
                        products.map((product) => {
                            const productImages = product.media_gallery_entries
                                ? product.media_gallery_entries.map(entry => entry.file)
                                : [];
                            const images = productImages.map(img => `https://m2web.staging-01.eposdirect.net/media/catalog/product${img}`);

                            const specialPrice = product.custom_attributes.find(attr => attr.attribute_code === 'special_price')?.value;
                            const formattedSpecialPrice = specialPrice ? parseFloat(specialPrice).toFixed(2) : null;

                            const productUrl = `/product/${product.id}`;

                            return (
                                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.id}>
                                    <Card
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            position: 'relative',
                                        }}
                                    >
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onMouseEnter={() => handleMouseEnter(product.id)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                        <Link to={productUrl}>

                                                <img
                                                    alt={product.name}
                                                    src={images.length > 0 ? images[0] : '/default.png'}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain',
                                                        transition: 'transform 0.3s ease',
                                                    }}
                                                />
                                        </Link>
                                                
                                                {hoveredProductId === product.id && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '0',
                                                            left: '0',
                                                            width: '100%',
                                                            backgroundColor: '#fff',
                                                            display: 'flex',
                                                            justifyContent: 'space-around',
                                                            padding: '10px 0',
                                                            zIndex: 2,
                                                        }}
                                                    >
                                                        {[ // Icons with circular background
                                                            {
                                                                icon: <ShoppingCartOutlined />,
                                                                onClick: () => handleAddToCart(product),
                                                            },
                                                            {
                                                                icon: <HeartOutlined />,
                                                                onClick: () => console.log('Add to wishlist'),
                                                            },
                                                            {
                                                                icon: <EyeOutlined />,
                                                                onClick: () => console.log('Quick view'),
                                                            },
                                                        ].map((item, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // prevent bubbling just in case
                                                                    item.onClick();
                                                                }}
                                                                style={{
                                                                    width: '36px',
                                                                    height: '36px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#fff',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.3s ease',
                                                                    border: '1px solid #ddd',
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#FFB144';
                                                                    // e.currentTarget.firstChild.style.color = '#FFB144';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#fff';
                                                                    e.currentTarget.firstChild.style.color = '#000';
                                                                }}
                                                            >
                                                                {React.cloneElement(item.icon, {
                                                                    style: {
                                                                        fontSize: '18px',
                                                                        color: '#000',
                                                                        transition: 'color 0.3s ease',
                                                                    },
                                                                })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}



                                            </div>
                                            <Link to={productUrl}>
                                        <Meta
                                            title={
                                                <div
                                                    style={{
                                                        wordWrap: 'break-word',
                                                        whiteSpace: 'normal',
                                                        color: '#041E25',
                                                        height: '48px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {product.name}
                                                </div>
                                            }
                                        />
                                        </Link>

                                        <div className="product-price" style={{ marginTop: '10px', minHeight: '40px' }}>
                                            {formattedSpecialPrice ? (
                                                <>
                                                    <strong style={{ color: '#116A83', fontWeight: 'bold' }}>
                                                        ${formattedSpecialPrice}
                                                    </strong>
                                                    <span
                                                        style={{
                                                            textDecoration: 'line-through',
                                                            fontWeight: 600,
                                                            marginLeft: '10px',
                                                            color: 'gray',
                                                        }}
                                                    >
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <strong>${product.price}</strong>
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <Col span={24}>
                            <Alert message="No products available at the moment." type="info" />
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    );
};

export default HomeProducts;
