import React from "react";
import { Menu, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { DownOutlined } from "@ant-design/icons";

const fetchCategories = async () => {
  const res = await fetch("/api/rest/V1/categories", {
  });
  console.log("Response status:", res.status);
  console.log("Response headers:", [...res.headers.entries()]);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  // Get level 2 categories (direct children of root)
  const level2Categories =
    data.children_data?.map((cat) => ({
      ...cat,
      key: cat.id.toString(),
      label: cat.name,
    })) || [];

  return level2Categories;
};

const Category = () => {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <Spin />;
  if (isError) return <div>Failed to load categories</div>;

  // Show only the first 5 categories
  const firstFiveCategories = categories.slice(0, 5);

  const renderSubMenu = (category) => {
    // If the category has children, we will render a SubMenu
    if (category.children_data && category.children_data.length > 0) {
      return {
        key: category.key,
        label: (
          <span>
            {category.label} <DownOutlined />
          </span>
        ),
        children: category.children_data.map((subCat) => ({
          key: subCat.id.toString(),
          label: subCat.name,
        })),
      };
    }
    return {
      key: category.key,
      label: category.label,
    };
  };

  // Prepare the menu items using the `renderSubMenu` function
  const menuItems = firstFiveCategories.map((category) => renderSubMenu(category));

  return (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={firstFiveCategories.length > 0 ? [firstFiveCategories[0].key] : []}
      style={{ borderBottom: "none" }}
      items={menuItems} // Use items instead of children
    />
  );
};

export default Category;
