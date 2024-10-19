import React from 'react'
import Brands from '../components/Brands';
import Footer from './../components/footer';
import Header from './../components/header';
import ProductSales from '../components/ProductSales';
import ProductNews from './../components/ProductNews';
import Category from '../components/Category';
import Banner from '../components/Banner';
import ProductBestSellers from '../components/ProductBestSellers';

function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <Category />
      <ProductNews />
      <ProductSales />
      <ProductBestSellers />
      <Brands />
      <Footer />
    </div>

  )
}

export default Home
