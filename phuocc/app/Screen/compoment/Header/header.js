import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from '../../../Service/CartService';

const Header = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]); // State cho giỏ hàng
  const [orderCount, setOrderCount] = useState(0); // State cho số đơn hàng trong giỏ hàng

  // Hàm để lấy giỏ hàng
  const fetchCartItems = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      const response = await CartService.getList(userId);
      setCartItems(response.cart || []); // Cập nhật giỏ hàng
    }
  };

  useEffect(() => {
    fetchCartItems(); // Lấy dữ liệu giỏ hàng lần đầu
  }, []);

  useEffect(() => {
    const count = cartItems.length; // Tính số đơn hàng
    setOrderCount(count);
  }, [cartItems]); // Cập nhật số đơn hàng khi cartItems thay đổi

  // Hàm để tự động lấy lại giỏ hàng khi có sự thay đổi
  const handleCartChange = () => {
    fetchCartItems(); // Gọi lại hàm lấy giỏ hàng khi có sự thay đổi
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
    handleCartChange(); // Gọi hàm để cập nhật giỏ hàng khi điều hướng đến giỏ hàng
  };

  // Hàm để mở trang Contact
  const handleMessagePress = () => {
    navigation.navigate('Contacts'); // Thay 'Contacts' bằng tên màn hình bạn đã định nghĩa trong navigator
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.searchInput} 
        placeholder="Tìm kiếm sản phẩm..." 
        placeholderTextColor="#888"
      />
      
      <TouchableOpacity style={styles.iconContainer} onPress={handleCartPress}>
        <View style={styles.cartIconContainer}>
          <Icon name="cart" size={24} color="#000" />
          {orderCount > 0 && (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{orderCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={handleMessagePress}>
        <Icon name="message" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  iconContainer: {
    marginLeft: 10,
  },
  cartIconContainer: {
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
