import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { Link } from 'react-router-dom';
function Cart() {
    return (
        <div>
            <Header />
            <section id="cart-page" className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-3/4">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-center md:text-left font-semibold">Product</th>
                                                <th className="text-center font-semibold">Price</th>
                                                <th className="text-center font-semibold">Quantity</th>
                                                <th className="text-center md:text-right font-semibold">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody id="cart-items">
                                            {/* Sample Product Row */}
                                            {[...Array(2)].map((_, index) => (
                                                <tr key={index} className="pb-4 border-b border-gray-300">
                                                    <td className="px-1 py-4">
                                                        <div className="flex items-center flex-col sm:flex-row text-center sm:text-left">
                                                            <img
                                                                className="h-16 w-16 md:h-24 md:w-24 sm:mr-8 mb-4 sm:mb-0"
                                                                src={`/assets/images/single-product/${index + 1}.jpg`}
                                                                alt="Product image"
                                                            />
                                                            <p className="text-sm md:text-base md:font-semibold">
                                                                {index === 0 ? 'Summer black dress' : 'Black suit'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-1 py-4 text-center">$19.99</td>
                                                    <td className="px-1 py-4 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <button className="cart-decrement border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-10 h-10 flex items-center justify-center">-</button>
                                                            <p className="quantity text-center w-8">1</p>
                                                            <button className="cart-increment border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-10 h-10 flex items-center justify-center">+</button>
                                                        </div>
                                                    </td>
                                                    <td className="px-1 py-4 text-right">$19.99</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="px-1 flex flex-col lg:flex-row justify-between items-center mt-10">
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                placeholder="Coupon code"
                                                className="border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none"
                                            />
                                            <button className="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary rounded-r-full py-2 px-4">Apply Coupon</button>
                                        </div>
                                        <div className="mt-4 lg:mt-0 flex space-x-2">
                                            <button className="bg-red-500 text-white py-2 px-4 rounded-full">Empty Cart</button>
                                            <button className="bg-primary text-white py-2 px-4 rounded-full">Update Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                                <div className="flex justify-between mb-4">
                                    <p>Subtotal</p>
                                    <p>$39.98</p>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <p>Taxes</p>
                                    <p>$1.99</p>
                                </div>
                                <div className="flex justify-between mb-4 pb-4 border-b border-gray-300">
                                    <p>Shipping</p>
                                    <p>$0.00</p>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <p className="font-semibold">Total</p>
                                    <p className="font-semibold">$41.97</p>
                                </div>
                                <Link to="/checkout" className="bg-primary text-white border hover:border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full mt-4 w-full text-center block">
                                    Proceed to checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Cart;
