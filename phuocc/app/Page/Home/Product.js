import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductService from '../../Service/ProductService';
import CategoryService from '../../Service/CategoryService';
import BrandService from '../../Service/BrandService';
import CartService from '../../Service/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Product() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceAlert, setPriceAlert] = useState('');
    const [showCategories, setShowCategories] = useState(false);
    const [showBrands, setShowBrands] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResult = await ProductService.getList();
                setProducts(productResult.products || []);
                setFilteredProducts(productResult.products || []);

                const categoriesResponse = await CategoryService.getList();
                setCategories([{ id: 'all', name: 'Tất cả danh mục' }, ...(categoriesResponse.categories || [])]);

                const brandsResponse = await BrandService.getList();
                setBrands([{ id: 'all', name: 'Tất cả thương hiệu' }, ...(brandsResponse.brands || [])]);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = products;

        // Kiểm tra nếu có danh mục được chọn và không phải là "all"
        if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(String(product.category_id))
            );
        }

        // Kiểm tra nếu có thương hiệu được chọn và không phải là "all"
        if (selectedBrands.length > 0 && !selectedBrands.includes('all')) {
            filtered = filtered.filter(product =>
                selectedBrands.includes(String(product.brand_id))
            );
        }

        // Nếu có bộ lọc giá, lọc theo giá
        if (minPrice !== '' && maxPrice !== '') {
            filtered = filtered.filter(product =>
                product.pricebuy >= minPrice && product.pricebuy <= maxPrice
            );
        }

        setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm đã lọc
    }, [selectedCategories, selectedBrands, minPrice, maxPrice, products]);



    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleProductClick = (id) => {
        navigation.navigate('ProductDetail', { id });
    };
    const handleCategoryChange = (id) => {
        if (id === 'all') {
            setSelectedCategories(['all']);
        } else {
            setSelectedCategories(prev =>
                prev.includes(id) ? prev.filter(categoryId => categoryId !== id) : [...prev, id]
            );
            setSelectedCategories(prev => prev.filter(id => id !== 'all')); // Xóa "all" nếu có
        }
    };


    const handleBrandChange = (id) => {
        if (id === 'all') {
            setSelectedBrands(['all']);
        } else {
            setSelectedBrands((prev) =>
                prev.includes(id) ? prev.filter(brandId => brandId !== id) : [...prev, id]
            );
            setSelectedBrands(prev => prev.filter(id => id !== 'all')); // Xóa "all" nếu có
        }
        setCurrentPage(1);
    };


    const handlePriceChange = (name, value) => {
        if (name === 'minPrice') {
            setMinPrice(value !== '' ? parseFloat(value) : '');
            if (value !== '' && parseFloat(value) > maxPrice) {
                setPriceAlert('Giá tối thiểu không thể lớn hơn giá tối đa!');
            } else {
                setPriceAlert('');
            }
        } else if (name === 'maxPrice') {
            setMaxPrice(value !== '' ? parseFloat(value) : '');
            if (value !== '' && parseFloat(value) < minPrice) {
                setPriceAlert('Giá tối đa không thể nhỏ hơn giá tối thiểu!');
            } else {
                setPriceAlert('');
            }
        }
        setCurrentPage(1);
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
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setShowCategories(!showCategories)} style={styles.filterButton}>
                    <Text style={styles.filterText}>Danh mục</Text>
                </TouchableOpacity>
                {showCategories && (
                    <View style={styles.dropdownMenu}>
                        {categories.map((category) => (
                            <TouchableOpacity key={category.id} onPress={() => handleCategoryChange(category.id)}>
                                <Text style={styles.sidebarItem}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity onPress={() => setShowBrands(!showBrands)} style={styles.filterButton}>
                    <Text style={styles.filterText}>Thương hiệu</Text>
                </TouchableOpacity>
                {showBrands && (
                    <View style={styles.dropdownMenu}>
                        {brands.map((brand) => (
                            <TouchableOpacity key={brand.id} onPress={() => handleBrandChange(brand.id)}>
                                <Text style={styles.sidebarItem}>{brand.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity onPress={() => setShowPrice(!showPrice)} style={styles.filterButton}>
                    <Text style={styles.filterText}>Khoảng giá</Text>
                </TouchableOpacity>
                {showPrice && (
                    <View style={styles.dropdownMenu}>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Giá tối thiểu"
                            keyboardType="numeric"
                            value={minPrice.toString()}
                            onChangeText={(value) => handlePriceChange('minPrice', value)}
                        />
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Giá tối đa"
                            keyboardType="numeric"
                            value={maxPrice.toString()}
                            onChangeText={(value) => handlePriceChange('maxPrice', value)}
                        />
                        {priceAlert ? <Text style={styles.alertText}>{priceAlert}</Text> : null}
                    </View>
                )}
            </View>

            <ScrollView style={styles.productList}>
                <View style={styles.productGrid}>
                    {currentProducts.map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            onPress={() => handleProductClick(product.id)}
                            style={styles.productCard}
                        >
                            <Image
                                source={{ uri: product.thumbnail }}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productCategory}>{product.category_name}</Text>
                                <Text style={styles.productPrice}>${product.pricebuy.toFixed(2)}</Text>
                                <TouchableOpacity
                                    style={styles.addToCartButton}
                                    onPress={(e) => {
                                        e.stopPropagation(); // Prevents triggering the product click event
                                        handleAddToCart(product.id, 1); // Set quantity to 1
                                    }}
                                >
                                    <Text style={styles.buttonText}>Thêm vào giỏ</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <TouchableOpacity key={index + 1} onPress={() => setCurrentPage(index + 1)}>
                            <Text style={styles.pageNumber}>{index + 1}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    filterContainer: {
        marginBottom: 16,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#007bff',
        borderRadius: 4,
        marginBottom: 8,
    },
    filterText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dropdownMenu: {
        backgroundColor: '#fff',
        borderRadius: 4,
        elevation: 1,
        padding: 8,
        marginBottom: 8,
    },
    sidebarItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    priceInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    alertText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    productList: {
        flex: 1,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        marginBottom: 16,
        width: '48%', // Adjust the width for responsiveness
        overflow: 'hidden',
    },
    productImage: {
        height: 150,
        width: '100%',
    },
    productInfo: {
        padding: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    addToCartButton: {
        backgroundColor: '#007BFF',
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    pageNumber: {
        marginHorizontal: 4,
        fontSize: 16,
        color: '#007bff',
        fontWeight: 'bold',
    },
});

export default Product;
