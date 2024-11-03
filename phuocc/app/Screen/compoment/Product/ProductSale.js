import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import ProductService from '../../../Service/ProductService'; // Adjust path if needed
import { ApiImages } from '../../../Api/ApiImages';
import CartService from '../../../Service/CartService';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProductSale() {
  const [productsale, setProductsale] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const limit = 99; // Limit the number of products
      const result = await ProductService.product_sale(limit);
      setProductsale(result.products);
    })();
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
    <View style={styles.container}>
      <Text style={styles.title}>Products Sale</Text>
      <ScrollView contentContainerStyle={styles.productList}>
        {productsale.length > 0 ? (
          productsale.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductClick(product.id)}
            >
              <Image
                source={{ uri: `${ApiImages}/images/product/${product.product_images[0]?.thumbnail}` }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.category}>{product.category}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.salePrice}>${product.pricesale}</Text>
                {product.pricebuy && (
                  <Text style={styles.originalPrice}>${product.pricebuy}</Text>
                )}
              </View>
              <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevents triggering the product click event
                    handleAddToCart(product.id, 1); // Set quantity to 1
                  }}
                >
                <Text style={styles.addToCartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noProducts}>No products available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noProducts: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default ProductSale;
