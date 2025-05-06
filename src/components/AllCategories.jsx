import React, { useEffect, useState } from 'react'; // <-- Added useState and useEffect imports
import useCategories from '../hooks/useCategories'; // Adjust the path as needed
import { Popover, List } from 'antd'; // Import Popover and List from Ant Design
import { DownOutlined } from '@ant-design/icons';

// Helper function to transform categories into list format
const transformCategoriesToListData = (categories) => {
  return Array.isArray(categories)
    ? categories.map((category) => ({
        title: category.name,
        key: category.id.toString(),
        children: category.children_data ? transformCategoriesToListData(category.children_data) : [],
      }))
    : [];
};

// Recursive render function to render category items
const renderCategoryList = (categories) => {
  return categories.map((category) => (
    <List.Item key={category.key}>
      <Popover
        content={
          // Only render children if they exist
          category.children && category.children.length > 0 ? (
            <List
              dataSource={category.children} // Pass the children as the data source
              renderItem={(child) => renderCategoryList([child])} // Recursive rendering of children
              style={{ paddingLeft: '20px' }} // Add padding to make nested items more visible
            />
          ) : null
        }
        trigger="hover" // Show on hover
        placement="right" // Position the popover to the right of the parent category
      >
        <span style={{ cursor: 'pointer', color: '#041E25' }}>{category.title}</span>
      </Popover>
    </List.Item>
  ));
};

// AllCategories Component - Fetches data and handles loading, errors
const AllCategories = () => {
  const { data, isError, error } = useCategories();
  const [categories, setCategories] = useState([]); // <-- Added state to hold transformed categories data

  // This will be executed once when the data is available
  useEffect(() => {
    if (data && data.children_data) { // <-- This block ensures categories data is transformed when available
      const activeCategories = data.children_data.filter(category => category.is_active);
      setCategories(transformCategoriesToListData(activeCategories)); // <-- Set transformed data to state
      // console.log(data.children_data);
      // console.log(activeCategories)
    }
  }, [data]); // <-- Dependency array: only re-run this effect if `data` changes

  // If there's an error, log it (you can handle it better, like showing an error message)
  if (isError) {
    console.error('Error fetching categories:', error.message);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>
        {/* Wrap the text with a Popover to show the categories list on hover */}
        <Popover
          content={
            <List
              dataSource={categories} // <-- Pass the transformed data (from state) as the data source
              renderItem={(item) => renderCategoryList([item])} // Render the categories recursively
              style={{ width: 300, maxHeight: 400, overflowY: 'auto' }} // Set styles for the list
            />
          }
          trigger="hover" // Show on hover
          placement="bottom" // Show the dropdown below the text
        >
          <span style={{ cursor: 'pointer', color: '#041E25' }}>
            Categories <DownOutlined style={{ color: '#041E25', fontSize: 20 }} />
          </span>
        </Popover>
      </h2>
    </div>
  );
};

export default AllCategories;
