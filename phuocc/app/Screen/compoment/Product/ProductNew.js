import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import ProductService from '../../../Service/ProductService';
import { ApiImages } from '../../../Api/ApiImages';
import { useNavigation } from '@react-navigation/native';
import CartService from '../../../Service/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProductNews() {
  const [productnew, setProductnew] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const limit = 99;  (async () => {
    
      try {
        const result = await ProductService.product_new(limit);
        if (result && result.products) {
          setProductnew(result.products);
        } else {
          console.log("No products found");
        }
      } catch (error) {
        console.error("Error fetching new products:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    })();
  }, []);

  const handleProductClick = (productId) => {
    navigation.navigate('ProductDetail', { id: productId });
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
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản Phẩm Mới</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <ScrollView contentContainerStyle={styles.productList}>
          {productnew.length > 0 ? (
            productnew.map((product) => (
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
                <Text style={styles.categoryName}>{product.category_name}</Text>
                <Text style={styles.price}>${product.pricebuy}</Text>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevents triggering the product click event
                    handleAddToCart(product.id, 1); // Set quantity to 1
                  }}
                >
                  <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noProducts}>Không có sản phẩm nào.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
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

export default ProductNews;
