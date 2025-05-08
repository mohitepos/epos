import React from "react";
import { Layout, Space } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppHeader from "./components/Header";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';  // Import BrowserRouter
import Register from "./components/Register";
import { ToastContainer } from 'react-toastify';
import CustomerDashboard from "./pages/CustomerDashboard";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import CategoryBar from "./components/CategoryBar";
import BannerSlider from "./components/BannerSlider";
import HomeCategory from "./components/HomeCategory";
import HomeProducts from "./components/HomeProducts";
import AppFooter from "./components/Footer";
import NotFound from "./components/NotFound";
import HomeSaleBanner from "./components/HomeSaleBanner";
import SingleBanner from "./components/SingleBanner";
import CartPage from "./components/CartPage";
import ProductPage from "./components/Product/ProductPage";

const { Content } = Layout;
const queryClient = new QueryClient();

function HomeContentWrapper() {
  const location = useLocation();
  return location.pathname === "/" ? (
    <>
      <BannerSlider />
      <HomeCategory />
      <HomeProducts />
      <HomeSaleBanner />
      <HomeProducts />
      <SingleBanner />
    </>
  ) : null;
}


function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppHeader />
            <CategoryBar />
            
            {/* Main Content Block with flex: 1 */}
            <Content style={{ flex: 1 }}>
              <HomeContentWrapper />
              <Routes>
                <Route path="/" element={<h2>Home Page content</h2>} />
                <Route path="/contact" element={<h2>Contact</h2>} />
                <Route path="/services" element={<h2>Services</h2>} />
                <Route path="/user" element={<h2>Login</h2>} />
                <Route path="/register" element={<Register />} />
                <Route path="/customer/account" element={<CustomerDashboard />} />
                <Route path="/cart" element={<CartPage />}/>
                <Route path="*" element={<NotFound />} />
                <Route path="/product/:sku" element={<ProductPage />} />
              </Routes>
            </Content>

            {/* Footer */}
            <AppFooter style={{ width: "100%" }} />
          </Layout>
        </QueryClientProvider>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
export default App;
