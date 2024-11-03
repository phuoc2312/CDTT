import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ProductService from '../../../Service/ProductService';
import RelatedProducts from '../../compoment/RelatedProducts/RelatedProducts';
import CartService from '../../../Service/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProductDetail() {
  const route = useRoute();
  const { id } = route.params; // Get ID from route parameters
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1); // Default quantity is 1

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await ProductService.getId(id);
        if (result && result.status) {
          const productData = result.product;
          setProduct(productData);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Unable to fetch product information');
      }
    };
    fetchProduct();
  }, [id]);

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
  

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, parseInt(value) || 1); // Ensure quantity is at least 1
    setQuantity(newValue);
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!product) {
    return <Text style={styles.loadingText}>Loading product information...</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.productTitle}>{product.name}</Text>
        <View style={styles.productContent}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productDetails}>
            <Text style={styles.price}>Price: <Text style={styles.priceValue}>${product.pricebuy}</Text></Text>
            <Text style={styles.category}>Category: <Text style={styles.categoryValue}>{product.category_name}</Text></Text>
            <Text style={styles.description}>Description: <Text style={styles.italicText}>{product.description}</Text></Text>
            <Text style={styles.content}>Content: <Text style={styles.italicText}>{product.content}</Text></Text>
          </View>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <TextInput
            keyboardType="numeric"
            value={String(quantity)}
            onChangeText={handleQuantityChange}
            style={styles.quantityInput}
          />
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

        {/* Related Products */}
        <RelatedProducts productId={id} categoryId={product.category_id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  productTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  productContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  productImage: {
    width: '50%',
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  priceValue: {
    color: '#333',
  },
  category: {
    fontSize: 16,
    color: '#333',
  },
  categoryValue: {
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#666',
  },
  italicText: {
    fontStyle: 'italic',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ProductDetail;
