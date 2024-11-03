import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this icon library if not already done
import Header from '../../Screen/compoment/Header/header';
import Banner from '../../Screen/compoment/Banner/banner';
import Category from '../../Screen/compoment/Category/category';
import ProductNew from '../../Screen/compoment/Product/ProductNew';
import ProductSale from '../../Screen/compoment/Product/ProductSale';
import ProductBestSellers from '../../Screen/compoment/Product/ProductBestSellers';
import Brands from '../../Screen/compoment/Brand/Brands';

const Feed = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Banner />

                <Text style={styles.sectionTitle}>Danh mục</Text>
                <Category />

                {/* New Products Section */}
                <View style={styles.latestPostsContainer}>
                    <Text style={styles.sectionTitle}>Sản Phẩm Mới</Text>
                    <TouchableOpacity
                        style={styles.seeAllContainer}
                        onPress={() => navigation.navigate('AllNewProducts')} // Change this to your specific screen name
                    >
                        <Text style={styles.seeAllText}>Xem tất cả</Text>
                        <Icon name="chevron-right" size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                <ProductNew limit={4} />

                {/* Discounted Products Section */}
                <View style={styles.latestPostsContainer}>
                    <Text style={styles.sectionTitle}>Sản Phẩm Giảm Giá</Text>
                    <TouchableOpacity
                        style={styles.seeAllContainer}
                        onPress={() => navigation.navigate('AllSaleProducts')} // Change this to your specific screen name
                    >
                        <Text style={styles.seeAllText}>Xem tất cả</Text>
                        <Icon name="chevron-right" size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                <ProductSale limit={4} />

                {/* Best Sellers Section */}
                <View style={styles.latestPostsContainer}>
                    <Text style={styles.sectionTitle}>Sản Phẩm Bán Chạy Nhất</Text>
                    <TouchableOpacity
                        style={styles.seeAllContainer}
                        onPress={() => navigation.navigate('AllBestSellers')} // Change this to your specific screen name
                    >
                        <Text style={styles.seeAllText}>Xem tất cả</Text>
                        <Icon name="chevron-right" size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                <ProductBestSellers limit={4}/>

                <Brands />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        marginTop: 20,
        marginLeft: 20,
        fontWeight: 'bold',
        fontSize: 16,
    },
    latestPostsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Align space evenly between items
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 10, // Bottom margin for the title
    },
    seeAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        fontSize: 14,
        color: '#888',
        marginRight: 5,
    },
});

export default Feed;
