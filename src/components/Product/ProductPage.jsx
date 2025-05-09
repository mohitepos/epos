import React, { useEffect, useState } from 'react';
import useProductById from '../../hooks/useProductById';
import { Spin, Card, Col, Row, Button, Typography, Select, Carousel, InputNumber, Input } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound';
import useAddToCart from '../../hooks/useAddToCart';
import ActionButton from '../ActionButton/ActionButton';

const { Title } = Typography;
const { Option } = Select;

const ProductPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useProductById(id);
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImage, setSelectedImage] = useState('/default.png');  // Default image initially
  const [quantity, setQuantity] = useState(1);  // Default quantity set to 1
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const { mutate: addToCart } = useAddToCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0 && data[0].product) {
      setProduct(data[0].product);
    }
  }, [data]);

  useEffect(() => {
    if (product) {
      const images = product.media_gallery?.images ? Object.values(product.media_gallery.images).map((entry) => {
        return `https://m2web.staging-01.eposdirect.net/media/catalog/product${entry.file}`;
      }) : [];
      setSelectedImage(images.length > 0 ? images[0] : '/default.png');
    }
  }, [product]);

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (isError || !product) {
    return <NotFound />;
  }

  const {
    name,
    price,
    sku: productSku,
    type_id,
    custom_attributes = [],
    child_products = [],
  } = product;


  const description = product.description || 'No description available';


  const images = product.media_gallery?.images ? Object.values(product.media_gallery.images).map((entry) => {
    return `https://m2web.staging-01.eposdirect.net/media/catalog/product${entry.file}`;
  }) : [];

  // Find the size and color options from child products
  const sizeOptions = {};
  const colorOptions = {};
  child_products.forEach((child) => {
    if (child.size) sizeOptions[child.size] = true;
    if (child.color) colorOptions[child.color] = true;
  });

  const handleOptionChange = (attributeId, valueIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: valueIndex,
    }));
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };
  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));  // Ensure quantity doesn't go below 1
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {

    // if (product.type_id === 'configurable') {
    //     console.log(`Redirecting to configurable product page: ${product.name}`);
    //     navigate(`/product/${product.id}`); // Navigate to configurable product page for selection
    //     return; // Prevent further execution
    // }
    const cartItem = {
      sku: product.sku,
      qty: 1
    };
    console.warn(cartItem);


    // Set global loading state to true when a product is being added to the cart
    setIsGlobalLoading(true);
    addToCart(cartItem, {
      onSettled: () => {
        setIsGlobalLoading(false); // Reset global loading state when the request is settled
      },
      onSuccess: () => {
        console.log("Added to cart:", product);
      },
      onError: (error) => {
        console.error("Error adding to cart:", error);
      }
    });
  };


  const renderOptionSelectors = () => {
    return (
      <>
        {Object.keys(sizeOptions).length > 0 && (
          <div key="size" style={{ marginBottom: 16 }}>
            <Title level={5}>Size</Title>
            <Select
              style={{ width: 200 }}
              placeholder="Select Size"
              onChange={(value) => handleOptionChange('size', value)}
              value={selectedOptions['size']}
            >
              {Object.keys(sizeOptions).map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </div>
        )}
        {Object.keys(colorOptions).length > 0 && (
          <div key="color" style={{ marginBottom: 16 }}>
            <Title level={5}>Color</Title>
            <Select
              style={{ width: 200 }}
              placeholder="Select Color"
              onChange={(value) => handleOptionChange('color', value)}
              value={selectedOptions['color']}
            >
              {Object.keys(colorOptions).map((color) => (
                <Option key={color} value={color}>
                  {color}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </>
    );
  };

  // Logic to determine if the product is simple or configurable
  const isSimpleProduct = type_id === 'simple';
  const isConfigurableProduct = type_id === 'configurable';

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[32, 32]}>
        {/* Left side: Thumbnails + Carousel */}
        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              {/* Thumbnail images */}
              {images.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                      onClick={() => handleThumbnailClick(image)}  // On thumbnail click, update main image
                    />
                  ))}
                </div>
              )}
            </Col>
            <Col span={18}>
              {/* Main carousel image */}
              {images.length > 1 ? (
                <Carousel
                  autoplay
                  style={{ marginTop: 16 }}
                  dots={true}
                  arrows={true} // Ensure arrows are enabled
                  swipeToSlide
                  draggable
                >
                  {images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        style={{
                          width: '100%',
                          maxHeight: 500,
                          objectFit: 'contain',
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <img
                  src={selectedImage}
                  alt={`Image of ${name}`}
                  style={{
                    width: '100%',
                    maxHeight: 500,
                    objectFit: 'contain',
                    borderRadius: 8,
                  }}
                />
              )}
            </Col>
          </Row>
        </Col>

        {/* Right side: Product Information + Buttons */}
        <Col xs={24} md={12}>
          <Title
            level={1}
            style={{
              fontSize: '30px',
              fontWeight: 800,
              marginBottom: 0,
              lineHeight: 'normal',
            }}
          >
            {name}
          </Title>
          <Title level={4} style={{ color: '#ff4d4f' }}>
            ${parseFloat(price).toFixed(2)}
          </Title>

          {/* Only show option selectors for configurable products */}
          {isConfigurableProduct && renderOptionSelectors()}

          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
              <Title level={5}>Quantity</Title>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 16,
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                }}
              >
                {/* Decrement Button */}
                <Button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  style={{
                    padding: '0 16px',
                    fontSize: '18px',
                    height: '32px',  // Set a fixed height
                    borderRadius: 0,
                    width: '40px'
                  }}
                >
                  –
                </Button>

                {/* Quantity Input */}
                <Input
                  type="text"
                  value={quantity}
                  style={{
                    width: 60,
                    textAlign: 'center',
                    fontSize: '18px',
                    height: '32px',  // Match height of buttons
                    border: 'none',
                    width: '40px'
                  }}
                  readOnly
                />

                {/* Increment Button */}
                <Button
                  onClick={handleIncrement}
                  style={{
                    padding: '0 16px',
                    fontSize: '18px',
                    height: '32px',  // Set a fixed height
                    borderRadius: 0,
                    width: '40px'
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          </div>


          <div style={{ marginTop: 24 }}>
            <ActionButton
              text="Add to Cart"
              onClick={handleAddToCart}
              disabled={false}  // Disable based on condition
            />
            <ActionButton
              text="Add to Wishlist"
              onClick={()=>{
                console.warn("handleAddToWishlist ");
              }}
            />
          </div>
        </Col>
      </Row>

      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Card title="Product Description">
          <div
          dangerouslySetInnerHTML={{ __html: description }}
        />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
