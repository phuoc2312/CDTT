import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiImages } from '../../../Api/ApiImages';
import UserService from '../../../Service/UserService';
import OrderService from '../../../Service/OrderService';

const Checkout = () => {
    const navigation = useNavigation();
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
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) return;

                const userData = await UserService.show(userId);
                // Ensure userData has the expected structure
                if (userData) {
                    setFormData({
                        name: userData.name || '',
                        phone: userData.phone || '',
                        email: userData.email || '',
                        address: userData.address || '',
                        note: '',
                    });
                } else {
                    setError("User data not found.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        const fetchCartItems = async () => {
            try {
                const storedCartItems = JSON.parse(await AsyncStorage.getItem('selectedItemsForCheckout')) || [];
                console.log('Cart Items:', storedCartItems); // Debugging line
                setCartItems(storedCartItems);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchUserData();
        fetchCartItems();
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.pricebuy * item.qty), 0).toFixed(2);
    };

    const handleChange = (id, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const updatedItems = cartItems.map(item => ({
                ...item,
                qty: Math.max(1, item.qty),
            }));

            const orderData = {
                user_id: userId,
                ...formData,
                status: 'pending',
                items: updatedItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.qty,
                    price: item.pricebuy, // Use pricebuy for the order
                })),
            };

            const response = await OrderService.createOrder(orderData);
            if (response) {
                Alert.alert("Order Placed", "Your order has been placed successfully!", [{ text: "OK", onPress: () => navigation.navigate('Home') }]);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            Alert.alert("Order Error", "There was an error placing your order. Please try again.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.billingDetails}>
                <Text style={styles.sectionTitle}>Billing Details</Text>
                <TextInput
                    placeholder="Full Name"
                    value={formData.name}
                    onChangeText={(value) => handleChange('name', value)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChangeText={(value) => handleChange('phone', value)}
                    style={styles.input}
                    keyboardType="phone-pad"
                />
                <TextInput
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(value) => handleChange('email', value)}
                    style={styles.input}
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Address"
                    value={formData.address}
                    onChangeText={(value) => handleChange('address', value)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Note"
                    value={formData.note}
                    onChangeText={(value) => handleChange('note', value)}
                    style={[styles.input, styles.noteInput]}
                    multiline
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Place Order</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.orderSummary}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <View key={index} style={styles.cartItem}>
                            <Image
                                source={{ uri: `${ApiImages}/images/product/${item.thumbnail}` }}
                                style={styles.productImage}
                            />
                            <View style={styles.cartItemDetails}>
                                <Text style={styles.productName}>{item.product_name}</Text>
                                <Text style={styles.productQuantity}>Quantity: {item.qty}</Text>
                            </View>
                            <Text style={styles.productPrice}>${(item.pricebuy * item.qty).toFixed(2)}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyCartText}>Your cart is empty.</Text>
                )}
                <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
    billingDetails: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    noteInput: {
        height: 60,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    orderSummary: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    cartItemDetails: {
        flex: 1,
    },
    productName: {
        fontWeight: 'bold',
    },
    productQuantity: {
        fontSize: 14,
        color: '#555',
    },
    productPrice: {
        fontWeight: 'bold',
    },
    emptyCartText: {
        textAlign: 'center',
        color: '#555',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
});

export default Checkout;
