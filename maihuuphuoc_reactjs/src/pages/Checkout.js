import React, { useState, useEffect } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { ApiImages } from '../Api/ApiImages';
import UserService from '../Service/UserService';
import OrderService from '../Service/OrderService';
import { useNavigate } from 'react-router-dom';

function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        note: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const userData = await UserService.show(userId);
                setFormData({
                    name: userData.name || '',
                    phone: userData.phone || '',
                    email: userData.email || '',
                    address: userData.address || '',
                    note: '',
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        // Lấy các sản phẩm được lưu trữ với cấu trúc đã sửa đổi
        const storedCartItems = JSON.parse(localStorage.getItem('selectedItemsForCheckout')) || [];
        setCartItems(storedCartItems);
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            const updatedItems = cartItems.map(item => ({
                ...item,
                qty: Math.max(1, item.qty), // Đảm bảo số lượng luôn lớn hơn hoặc bằng 1
            }));

            const orderData = {
                user_id: userId,
                ...formData,
                status: 'pending',
                items: updatedItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.qty,
                    price: item.price,
                })),
            };

            console.log("Order Data:", orderData);

            const response = await OrderService.createOrder(orderData);
            if (response) {
                console.log('Order placed successfully:', response);
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
        }
        navigate('/');
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <section id="checkout-page" className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-2/3 bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="mb-2 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="mb-2 block">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="address" className="mb-2 block">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="note" className="mb-2 block">Note</label>
                                    <textarea
                                        id="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows="3"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 text-white bg-primary hover:bg-transparent hover:text-primary rounded-lg py-2 px-4"
                                >
                                    Place Order
                                </button>
                            </form>
                        </div>
                        <div className="md:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    {cartItems.length > 0 ? (
                                        cartItems.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-line">
                                                <div className="flex items-center">
                                                    <img
                                                        src={`${ApiImages}/images/product/${item.thumbnail}`}
                                                        alt={item.name}
                                                        className="w-16 h-16 lg:w-32 lg:h-32 object-contain mb-4 rounded-md"
                                                    />
                                                    <div className="ml-4">
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-sm">Quantity: {item.qty}</p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center">Your cart is empty.</p>
                                    )}
                                </div>
                                <p className="mt-4 font-semibold">Total: ${calculateTotal()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Checkout;
