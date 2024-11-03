import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ProductService from '../../../Service/ProductService';
import CartService from '../../../Service/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RelatedProducts = ({ productId, categoryId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const result = await ProductService.getRelatedProducts(productId, categoryId);
                if (result && result.status) {
                    setRelatedProducts(result.related_products);
                } else {
                    setError(result.message || 'Không thể tải sản phẩm liên quan');
                }
            } catch {
                setError('Không thể tải sản phẩm liên quan');
            }
        };

        fetchRelatedProducts();
    }, [productId, categoryId]);

    const handleAddToCart = async (productId, quantity) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                Alert.alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
                return;
            }

            const response = await CartService.add({ user_id: userId, product_id: productId, qty: quantity });
            if (response && response.status) {
                Alert.alert(response.message);
            } else {
                Alert.alert('Lỗi khi thêm sản phẩm vào giỏ hàng.');
            }
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        }
    };

    const renderProductItem = ({ item }) => (
        <View style={styles.productCard}>
            <TouchableOpacity onPress={() => {/* Navigate to product detail */ }}>
                <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.pricebuy.toFixed(2)}</Text>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={(e) => {
                        e.stopPropagation(); // Prevents triggering the product click event
                        handleAddToCart(item.id, 1); // Set quantity to 1
                    }}
                >
                    <Text style={styles.addButtonText}>Add to cart</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sản phẩm liên quan</Text>
            {relatedProducts.length > 0 ? (
                <FlatList
                    data={relatedProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProductItem}
                    numColumns={2}
                    contentContainerStyle={styles.productList}
                />
            ) : (
                <Text style={styles.noProducts}>Không có sản phẩm nào liên quan.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    productList: {
        justifyContent: 'space-between',
    },
    productCard: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
        marginHorizontal: 5,
        flex: 1,
    },
    productImage: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10,
        marginBottom: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4500',
    },
    noProducts: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    addToCartButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 50
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RelatedProducts;
