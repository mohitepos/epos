import React from 'react';
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
          ) :null
        }
        // title={category.title}
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
  const { data, isLoading, isError, error } = useCategories();

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // No data or invalid data format state
  if (!data || !data.children_data || !Array.isArray(data.children_data) || data.children_data.length === 0) {
    return <div>No categories found or invalid data format.</div>;
  }

  // Transform the categories data into a simple list format
  const listData = transformCategoriesToListData(data.children_data);

  return (
    <div>
      <h2>
        {/* Wrap the text with a Popover to show the categories list on hover */}
        <Popover
          content={
            <List
              dataSource={listData} // Pass the transformed list data
              renderItem={(item) => renderCategoryList([item])} // Render the categories recursively
              style={{ width: 300, maxHeight: 400, overflowY: 'auto' }} // Set styles for the list
            />
          }
          trigger="hover" // Show on hover
          placement="bottom" // Show the dropdown below the text
        >
          <span style={{ cursor: 'pointer', color: '#041E25' }}>Categories<DownOutlined style={{color:'#041E25', fontSize:20}}/></span>
        </Popover>
      </h2>
    </div>
  );
};

export default AllCategories;
