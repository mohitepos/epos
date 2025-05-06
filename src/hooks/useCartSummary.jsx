import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCartSummary = async () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerToken = customer.token;
  if (!customerToken) throw new Error('User not logged in');

  try {
    const res = await axios.get('/api/rest/V1/carts/mine', {
      headers: {
        Authorization: `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      console.log('No cart found, creating one...');
      const createCartRes = await axios.post('/api/rest/V1/carts/mine', {}, {
        headers: {
          Authorization: `Bearer ${customerToken}`,
        },
      });
      return createCartRes.data;
    }
    throw error;
  }
};

// Custom hook for fetching cart summary
export const useCartSummary = () =>
  useQuery({
    queryKey: ['cart-summary'],
    queryFn: fetchCartSummary,
    enabled: !!JSON.parse(localStorage.getItem('customer'))?.token, // Only fetch when logged in
    refetchOnWindowFocus: false,  // Avoid refetching on window focus unless needed
    refetchInterval: false, // No automatic polling
    refetchOnReconnect: true, // Refetch when the page is reconnected (on network reconnect)
    refetchOnMount: true, 
  });
