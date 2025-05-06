// src/components/AddToCart.js
import axios from 'axios';

const addToCart = async () => {
  const token =
    'eyJraWQiOiIxIiwiYWxnIjoiSFMyNTYifQ.eyJ1aWQiOjIsInV0eXBpZCI6MywiaWF0IjoxNzQ2MDAyMjIwLCJleHAiOjE3NDYwMDU4MjB9.x78WMulWjKxYJuB1NO6k3hSPjIyc9GzaAuGp_RFPjec';

  try {
    const response = await axios.post(
      'http://aws.magento.com/rest/V1/carts/mine/items',
      {
        cartItem: {
          sku: '24-WG087',
          qty: 1,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Item added:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.data);
    } else {
      console.error('❌ Request Error:', error.message);
    }
  }
};

// Run when file is imported
addToCart();
