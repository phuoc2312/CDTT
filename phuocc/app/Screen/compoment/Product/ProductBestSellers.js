import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import ProductService from '../../../Service/ProductService';
import { ApiImages } from '../../../Api/ApiImages';
import { useNavigation } from '@react-navigation/native';
import CartService from '../../../Service/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProductBestSellers() {
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const limit = 99; // Limit the number of products
                const result = await ProductService.product_bestseller(limit);
                setProducts(result.products);
            } catch (error) {
                console.error('Error fetching best-selling products:', error);
            }
        };
        fetchBestSellers();
    }, []);

    const handleProductClick = (id) => {
        navigation.navigate('ProductDetail', { id });
    };
    const handleAddToCart = async (productId, quantity) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                Alert.alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
                return;
            }

            const response = await CartService.add({ user_id: userId, product_id: productId, qty: quantity });
            console.log("Phản hồi từ API:", response); // Ghi lại toàn bộ phản hồi

            if (response && response.status) {
                Alert.alert(response.message);
            } else {
            }
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        }


        try {
            const response = await CartService.add(cartItem);
        } catch (error) {
        }
    };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Product Bestseller</Text>
            <View style={styles.productsContainer}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            style={styles.productCard}
                            onPress={() => handleProductClick(product.id)}
                        >
                            <Image
                                source={{ uri: `${ApiImages}/images/product/${product.product_images[0]?.thumbnail}` }}
                                style={styles.productImage}
                            />
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productCategory}>{product.category_name}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>${product.pricebuy}</Text>
                                {product.pricesale && (
                                    <Text style={styles.oldPrice}>${product.pricesale}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.addToCartButton}
                                onPress={(e) => {
                                    e.stopPropagation(); // Prevents triggering the product click event
                                    handleAddToCart(product.id, 1); // Set quantity to 1
                                }}
                            >
                                <Text style={styles.addToCartText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noProductsText}>No best-selling products available.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
    },
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '47%',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    productImage: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
        borderRadius: 8,
        marginBottom: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productCategory: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    oldPrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
        color: 'gray',
        marginLeft: 8,
    },
    addToCartButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontWeight: '600',
    },
    noProductsText: {
        textAlign: 'center',
        color: 'gray',
        marginVertical: 20,
    },
});

export default ProductBestSellers;
