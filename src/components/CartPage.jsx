import React from "react";
import { Table, Typography, Button, Spin, notification } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

// Fetch cart (including items)
const fetchCartData = async () => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    const customerToken = customer.token;
  const response = await fetch("/api/rest/V1/carts/mine", {
    headers: {
      Authorization: `Bearer ${customerToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart data");
  }

  return response.json();
};

// Delete an item from the cart
const deleteCartItem = async (itemId) => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    const customerToken = customer.token;
  const response = await fetch(`/api/rest/V1/carts/mine/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${customerToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove item from cart");
  }

  return response.json();
};

const CartPage = () => {
  const navigate = useNavigate();

  const {
    data: cart,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cartData"],
    queryFn: fetchCartData,
  });

  const { mutate: removeItem, isLoading: isRemoving } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      notification.success({ message: "Item removed from cart" });
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Error removing item",
        description: error.message || "Failed to remove item.",
      });
    },
  });

  const handleRemove = (itemId) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    notification.success({ message: "Proceeding to checkout!" });
    navigate("/checkout");
  };

  if (isLoading) return <Spin size="large" style={{ marginTop: 50 }} />;
  if (isError) return <div>Failed to load cart information</div>;

  const items = cart.items || [];

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          onClick={() => handleRemove(record.item_id)}
          loading={isRemoving}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "40px 10%" }}>
      <Title level={2}>Your Cart</Title>
      <Table
        dataSource={items}
        columns={columns}
        rowKey="item_id"
        pagination={false}
      />

      {items.length > 0 && (
        <Button
          type="primary"
          onClick={handleCheckout}
          style={{ marginTop: 20 }}
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default CartPage;
