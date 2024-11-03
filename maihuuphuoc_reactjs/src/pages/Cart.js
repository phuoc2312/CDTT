import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { Link, useNavigate } from 'react-router-dom';
import CartService from '../Service/CartService';
import { ApiImages } from '../Api/ApiImages';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({}); // State to track selected items
    const userId = localStorage.getItem('userId'); // Get userId from Local Storage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            if (userId) {
                try {
                    const response = await CartService.getList(userId); // Call API with userId
                    if (response.status && response.cart.length > 0) {
                        setCartItems(response.cart); // Set cartItems from response
                    } else {
                        console.log("No cart items found or error in response:", response);
                        setCartItems([]); // Set cartItems to empty
                    }
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                    setCartItems([]); // Set cartItems to empty if there's an error
                }
            } else {
                console.log("User ID not found in Local Storage.");
            }
        };

        fetchCartItems();
    }, [userId]);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Ensure minimum quantity is 1
        try {
            await CartService.update(itemId, newQuantity);
            const updatedCartItems = cartItems.map(item =>
                item.id === itemId ? { ...item, qty: newQuantity } : item
            );
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await CartService.delete(itemId);
            setCartItems(cartItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error.response?.data || error.message);
        }
    };

    // Calculate total based on selected items
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems[item.id]) { // Check if item is selected
                const price = item.pricesale && item.pricesale < item.pricebuy ? item.pricesale : item.pricebuy;
                return total + price * item.qty;
            }
            return total;
        }, 0).toFixed(2);
    };

    const handleProceedToCheckout = () => {
        // Get selected products with `product_id`
        const selectedProducts = cartItems
            .filter(item => selectedItems[item.id]) // Use `item.id` to check if the product is selected
            .map(item => ({
                product_id: item.product_id, // Ensure to save `product_id`
                qty: item.qty,
                price: item.pricesale && item.pricesale < item.pricebuy ? item.pricesale : item.pricebuy, // Choose the sale price if available
                thumbnail: item.thumbnail
            }));

        // Log selected products for checkout
        console.log("Selected products for checkout:", selectedProducts);

        // Store selected products in localStorage
        localStorage.setItem('selectedItemsForCheckout', JSON.stringify(selectedProducts));

        // Navigate to checkout page
        navigate('/checkout');
    };

    return (
        <div>
            <Header />
            <section id="cart-page" className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-3/4">
                                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-center md:text-left font-semibold">Select</th>
                                                    <th className="text-center md:text-left font-semibold">Product</th>
                                                    <th className="text-center font-semibold">Price</th>
                                                    <th className="text-center font-semibold">Quantity</th>
                                                    <th className="text-center md:text-right font-semibold">Total</th>
                                                    <th className="text-center font-semibold">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map(item => {
                                                    const effectivePrice = item.pricesale && item.pricesale < item.pricebuy ? item.pricesale : item.pricebuy;
                                                    return (
                                                        <tr key={item.id} className="pb-4 border-b border-gray-300">
                                                            <td className="px-1 py-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedItems[item.id] || false}
                                                                    onChange={() => {
                                                                        setSelectedItems(prev => ({
                                                                            ...prev,
                                                                            [item.id]: !prev[item.id]
                                                                        }));
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="px-1 py-4">
                                                                <div className="flex items-center flex-col sm:flex-row text-center sm:text-left">
                                                                    <img
                                                                        src={`${ApiImages}/images/product/${item.thumbnail}`}
                                                                        alt={item.name}
                                                                        className="w-24 h-24 lg:w-32 lg:h-32 object-contain mb-4 rounded-md"
                                                                    />
                                                                    <p className="text-sm md:text-base md:font-semibold">
                                                                        {item.product_name}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="px-1 py-4 text-center">${effectivePrice}</td>
                                                            <td className="px-1 py-4 text-center">
                                                                <div className="flex items-center justify-center">
                                                                    <button
                                                                        className="cart-decrement border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-10 h-10 flex items-center justify-center"
                                                                        onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                                                                        disabled={item.qty <= 1}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <p className="quantity text-center w-8">{item.qty}</p>
                                                                    <button
                                                                        className="cart-increment border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-10 h-10 flex items-center justify-center"
                                                                        onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-1 py-4 text-right">${(effectivePrice * item.qty).toFixed(2)}</td>
                                                            <td className="px-1 py-4 text-right">
                                                                <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* Summary section */}
                            <div className="md:w-1/4">
                                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                    <h2 className="text-lg font-semibold mb-4">Summary</h2>
                                    <p className="font-semibold">Total: ${calculateTotal()}</p>
                                    <Link to="/checkout" className="mt-4 block text-center text-white bg-primary hover:bg-transparent hover:text-primary rounded-lg py-2" onClick={handleProceedToCheckout}>Proceed to Checkout</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Cart;
