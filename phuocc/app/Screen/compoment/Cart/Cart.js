import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import CartService from '../../../Service/CartService';
import { ApiImages } from '../../../Api/ApiImages';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [userId, setUserId] = useState(null); // State for userId
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('userId'); // Use AsyncStorage
                setUserId(id); // Set userId state
            } catch (error) {
                console.error("Error fetching userId from AsyncStorage:", error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (userId) {
                try {
                    const response = await CartService.getList(userId);
                    console.log("Dữ liệu giỏ hàng:", response); // Kiểm tra dữ liệu trả về
                    if (response.status && response.cart.length > 0) {
                        setCartItems(response.cart);
                    } else {
                        console.log("No cart items found or error in response:", response);
                        setCartItems([]);
                    }
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                    setCartItems([]);
                }
            } else {
                console.log("User ID not found.");
            }
        };

        fetchCartItems();
    }, [userId]); // Depend on userId

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Minimum quantity is 1
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

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems[item.id]) {
                return total + item.priceroot * item.qty;
            }
            return total;
        }, 0).toFixed(2);
    };

    const handleProceedToCheckout = async () => {
        const selectedProducts = cartItems.filter(item => selectedItems[item.id]);
        console.log("Selected products for checkout:", selectedProducts);
        
        // Kiểm tra nếu không có sản phẩm nào được chọn
        if (selectedProducts.length === 0) {
            Alert.alert("Warning", "Please select at least one item to proceed to checkout.");
            return;
        }

        // Lưu sản phẩm đã chọn vào AsyncStorage
        try {
            await AsyncStorage.setItem('selectedItemsForCheckout', JSON.stringify(selectedProducts));
            // Điều hướng đến trang Checkout
            navigation.navigate('Checkout', { selectedProducts });
        } catch (error) {
            console.error("Error saving selected products to AsyncStorage:", error);
            Alert.alert("Error", "Unable to proceed to checkout.");
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <TouchableOpacity onPress={() => {
                setSelectedItems(prev => ({
                    ...prev,
                    [item.id]: !prev[item.id]
                }));
            }} style={styles.checkbox}>
                <View style={[styles.checkboxCircle, selectedItems[item.id] && styles.checkedCheckbox]}>
                    {selectedItems[item.id] && <View style={styles.checkedInner} />}
                </View>
            </TouchableOpacity>
            <Image
                source={{ uri: `${ApiImages}/images/product/${item.thumbnail}` }}
                style={styles.image}
            />
            <Text style={styles.productName}>{item.product_name}</Text>
            <Text style={styles.price}>${item.pricebuy.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.qty - 1)} disabled={item.qty <= 1}>
                    <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.qty}</Text>
                <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.qty + 1)}>
                    <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Shopping Cart</Text>
            {cartItems.length === 0 ? (
                <Text>Your cart is empty.</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={item => item.id.toString()}
                    />
                    <View style={styles.summary}>
                        <Text style={styles.total}>Total: ${calculateTotal()}</Text>
                        <TouchableOpacity onPress={handleProceedToCheckout} style={styles.checkoutButton}>
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCheckbox: {
        borderColor: '#007BFF',
    },
    checkedInner: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: '#007BFF',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    productName: {
        flex: 1,
        marginLeft: 10,
    },
    price: {
        marginRight: 10,
        fontSize: 16,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        fontSize: 18,
        paddingHorizontal: 10,
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: 5,
    },
    deleteButton: {
        color: 'red',
        marginLeft: 10,
    },
    summary: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    checkoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Cart;
