import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProductService from '../../../Service/ProductService';
import CartService from '../../../Service/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure to import AsyncStorage

const ProductsByCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const fetchProducts = async () => {
            const categoryId = route.params?.category_id;

            try {
                const response = await ProductService.getProductsByCategory(categoryId);
                setProducts(response.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [route.params]);

    const handleProductClick = (id) => {
        navigation.navigate('ProductDetail', { id });
    };

    const handleAddToCart = async (product) => {
        const quantity = 1; // Default quantity

        const userId = await AsyncStorage.getItem('userId');
        const cartItem = {
            user_id: userId,
            product_id: product.id,
            qty: quantity,
        };

        try {
            const response = await CartService.add(cartItem);
            console.log('Product added to cart:', response);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductClick(item.id)} style={styles.productContainer}>
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category_name}</Text>
            <Text style={styles.productPrice}>${item.pricebuy}</Text>
            <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleAddToCart(item); }} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Products By Category</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.productList}
                    showsVerticalScrollIndicator={false} // Hide scroll indicator
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Light gray background for contrast
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#343a40', // Dark color for title
    },
    productList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    productContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5, // For Android shadow
    },
    productImage: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 4,
        color: '#495057', // Darker color for product name
    },
    productCategory: {
        fontSize: 14,
        color: '#868e96', // Grey color for category
        textAlign: 'center',
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28a745', // Green color for price
        marginVertical: 8,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#0056b3', // Darker blue border
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProductsByCategory;
