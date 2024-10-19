import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';

function Checkout() {
    return (
        <div>
            <Header />
            <section id="checkout-page" className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Billing and Shipping Details */}
                        <div className="md:w-2/3 bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="billing-name" className="mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        id="billing-name"
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="billing-email" className="mb-2 block">Email</label>
                                    <input
                                        type="email"
                                        id="billing-email"
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="billing-address" className="mb-2 block">Address</label>
                                    <input
                                        type="text"
                                        id="billing-address"
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="billing-city" className="mb-2 block">City</label>
                                    <input
                                        type="text"
                                        id="billing-city"
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="billing-state" className="mb-2 block">State</label>
                                        <input
                                            type="text"
                                            id="billing-state"
                                            className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="billing-zip" className="mb-2 block">ZIP Code</label>
                                        <input
                                            type="text"
                                            id="billing-zip"
                                            className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="billing-phone" className="mb-2 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="billing-phone"
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="mb-2 block">Ship to a different address?</label>
                                    <input type="checkbox" id="different-address" className="mr-2" />
                                    <label htmlFor="different-address" className="text-gray-700">Yes</label>
                                </div>
                            </form>
                        </div>
                        {/* Order Summary */}
                        <div className="md:w-1/3 bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-4">
                                <p>Subtotal</p>
                                <p>$59.00</p>
                            </div>
                            <div className="flex justify-between mb-4">
                                <p>Shipping</p>
                                <p>$10.00</p>
                            </div>
                            <div className="flex justify-between mb-4 border-b border-gray-300 pb-4">
                                <p className="font-semibold">Total</p>
                                <p className="font-semibold">$69.00</p>
                            </div>
                            <button className="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full w-full">
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Checkout;
