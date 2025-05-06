import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { notification } from 'antd';

const useAddToCart = () => {
  const mutation = useMutation({
    mutationFn: async ({ sku, qty }) => {
      const customer = JSON.parse(localStorage.getItem("customer"));
      const customerToken = customer.token;
      if (!customerToken) {
        throw new Error('Please Login. Guest Checkout is not allowed.');
      }

      // Get or create quote ID
      const getQuoteId = async () => {
        try {
          const response = await axios.get('/api/rest/V1/carts/mine', {
            headers: {
              Authorization: `Bearer ${customerToken}`,
              'Content-Type': 'application/json',
            },
          });
          return response.data.id || response.data;
        } catch {
          const createResponse = await axios.post('/api/rest/V1/carts/mine', {}, {
            headers: {
              Authorization: `Bearer ${customerToken}`,
              'Content-Type': 'application/json',
            },
          });
          return createResponse.data.id || createResponse.data;
        }
      };

      const quoteId = await getQuoteId(); // You need this line to actually trigger quote ID creation
      console.log('Quote ID:', quoteId);

      // Add item to cart
      const response = await axios.post(
        '/api/rest/V1/carts/mine/items',
        {
          cartItem: {
            quote_id: quoteId, // Optional in some setups, but safe to include
            sku,
            qty,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${customerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      notification.success({
        message: 'Item Added to Cart',
        description: 'Your item has been successfully added to the cart.',
      });
      console.log('Item added to cart successfully:', data);
    },

    onError: (error) => {
      notification.error({
        message: 'Add to Cart Failed',
        description: error.message,
      });
      console.error('Failed to add item to cart:', error);
    },

    onSettled: () => {
      console.log('Mutation has settled');
    },
  });

  return mutation;
};

export default useAddToCart;
