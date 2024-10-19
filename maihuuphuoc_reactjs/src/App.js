import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './auth/register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Shop from './pages/Shop';
import Login from './auth/Login';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import ProductsByCategory from './pages/ProductsByCategory';
import ProductsByBrand from './pages/ProductsByBrand';
import Blogs from './pages/Blogs';
import PostsByTopic from './pages/PostsByTopic';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/post/:topicId" element={<PostsByTopic />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/{id}" element={<ProductDetail />} />
          <Route path="/products/category" element={<ProductsByCategory />} />
          <Route path="/products/brand" element={<ProductsByBrand />} />
        </Routes>
      </div>
    </Router>
  );
}
