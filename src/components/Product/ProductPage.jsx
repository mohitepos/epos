import React, { useEffect, useState } from 'react';
import useProductBySku from '../../hooks/useProductById';
import { Spin, Alert, Card, Col, Row, Button, Typography, Select } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound';

const { Title } = Typography;
const { Option } = Select;

const ATTRIBUTE_OPTIONS = {
  93: {
    label: 'Color',
    values: { 4: 'Black' }
  },
  137: {
    label: 'Size',
    values: {
      5: 'XS', 6: 'S', 7: 'M', 8: 'L', 9: 'XL'
    }
  }
};

const ProductPage = () => {
  const { sku } = useParams();
  const { data, isLoading, isError } = useProductBySku(sku);
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (data) setProduct(data);
  }, [data]);

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (isError || !product) {
    return <NotFound />;
  }

  const {
    name,
    price,
    media_gallery_entries,
    sku: productSku,
    type_id,
    extension_attributes = {},
    custom_attributes = []
  } = product;

  const descriptionAttr = custom_attributes.find(attr => attr.attribute_code === 'meta_description');
  const description = descriptionAttr?.value || 'No description available';

  const images = media_gallery_entries?.map(entry =>
    `https://m2web.staging-01.eposdirect.net/media/catalog/product${entry.file}`
  ) || [];
  const productImage = images[0] || '/default.png';

  const handleOptionChange = (attributeId, valueIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attributeId]: valueIndex,
    }));
  };

  const renderOptionSelectors = () => {
    const options = extension_attributes.configurable_product_options || [];

    return options.map(opt => {
      const attr = ATTRIBUTE_OPTIONS[opt.attribute_id];
      if (!attr) return null;

      return (
        <div key={opt.attribute_id} style={{ marginBottom: 16 }}>
          <Title level={5}>{attr.label}</Title>
          <Select
            style={{ width: 200 }}
            placeholder={`Select ${attr.label}`}
            onChange={(value) => handleOptionChange(opt.attribute_id, value)}
            value={selectedOptions[opt.attribute_id]}
          >
            {opt.values.map(val => (
              <Option key={val.value_index} value={val.value_index}>
                {attr.values[val.value_index]}
              </Option>
            ))}
          </Select>
        </div>
      );
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <img
            src={productImage}
            alt={`Image of ${name}`}
            style={{ width: '100%', maxHeight: 500, objectFit: 'contain', borderRadius: 8 }}
          />
        </Col>

        <Col xs={24} md={12}>
        <Title
      level={1}
      style={{
        fontSize: '30px',
        fontWeight: 800,
        marginBottom: 0,
        lineHeight: 'normal',
      }}
    >{name}</Title>
          <Title level={4} style={{ color: '#ff4d4f' }}>${price}</Title>

          {type_id === 'configurable' && renderOptionSelectors()}

          <div style={{ marginTop: 24 }}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              disabled={type_id === 'configurable' && Object.keys(selectedOptions).length < 2}
              onClick={() => {
                console.log('Add to cart:', {
                  sku: productSku,
                  type: type_id,
                  options: selectedOptions
                });
              }}
              style={{ marginRight: 16 }}
            >
              Add to Cart
            </Button>
            <Button icon={<HeartOutlined />} size="large">Add to Wishlist</Button>
          </div>
        </Col>

        <Col span={24}>
          <Card title="Product Description">
            <p>{description}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
