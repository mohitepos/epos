import { useMutation } from '@tanstack/react-query';
import apiClient from '../utils/axios'; // Use your centralized axios client for API requests
import { notification } from 'antd';

// Custom hook to add items to cart
const useAddToCart = () => {
  const mutation = useMutation({
    mutationFn: async ({ sku, qty }) => {
      const customer = JSON.parse(localStorage.getItem("customer"));
      const customerToken = customer?.token;
      
      if (!customerToken) {
        throw new Error('Please Login. Guest Checkout is not allowed.');
      }

      // Get or create quote ID
      const getQuoteId = async () => {
        try {
          const response = await apiClient.get('/rest/V1/carts/mine', {
            headers: {
              Authorization: `Bearer ${customerToken}`,
              'Content-Type': 'application/json',
            },
          });
          return response.data.id || response.data; // Return the quote ID or response
        } catch {
          const createResponse = await apiClient.post('/rest/V1/carts/mine', {}, {
            headers: {
              Authorization: `Bearer ${customerToken}`,
              'Content-Type': 'application/json',
            },
          });
          return createResponse.data.id || createResponse.data; // Return the created quote ID
        }
      };

      // Get the quote ID (cart identifier)
      const quoteId = await getQuoteId(); 
      console.log('Quote ID:', quoteId);

      // Add the product to the cart
      const response = await apiClient.post(
        '/rest/V1/carts/mine/items',
        {
          cartItem: {
            quote_id: quoteId, // Optional but safe to include
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

      return response.data; // Return response data
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
        description: error?.message || 'An error occurred while adding the item to the cart.',
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
