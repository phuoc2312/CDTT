import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './auth/register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './auth/Login';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import ProductsByCategory from './pages/ProductsByCategory';
import ProductsByBrand from './pages/ProductsByBrand';
import Blogs from './pages/Blogs';
import PostsByTopic from './pages/PostsByTopic';
import Contacts from './pages/Contacts';
import RelatedProducts from './pages/RelatedProducts';

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
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} /> 
          <Route path="/products/category" element={<ProductsByCategory />} />
          <Route path="/products/brand" element={<ProductsByBrand />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/related/:id" element={<RelatedProducts />} />
        </Routes>
      </div>
    </Router>
  );
}
