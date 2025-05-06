import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'


const fetchProduct = async() =>{
    try {
        const response = await axios.get('/api/rest/default/V1/U/products?searchCriteria[pageSize]=20')
        console.log("Fetch Product Data",response)
        return response.data;
    } catch (error) {
        throw new Error("Error Fetching Product");
    }

}
const useProduct = () => {
  return useQuery({
    queryKey:['Products'],
    queryFn:fetchProduct,
    staleTime: Infinity, 
    refetchOnWindowFocus: false,
    retry: false, 
  })
}

export default useProduct
