import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Alert, Dimensions } from 'react-native';
import BrandService from '../../../Service/BrandService';
import { ApiImages } from '../../../Api/ApiImages';

const { width } = Dimensions.get('window');

function Brands() {
  const [brands, setBrands] = useState([]);
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);  // Track scroll position

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const result = await BrandService.getList();
        setBrands(result.brands);
      } catch (error) {
        console.error('Error fetching brands:', error);
        Alert.alert('Error', 'Unable to load brands. Please check your connection or try again later.');
      }
    };

    fetchBrands();
  }, []);

  // Function for continuous scroll
  const startContinuousScroll = () => {
    if (scrollRef.current) {
      scrollPosition.current += 1; // Scroll incrementally
      scrollRef.current.scrollTo({ x: scrollPosition.current, animated: false });

      // Reset scroll position when reaching the end
      if (scrollPosition.current >= width * brands.length) {
        scrollPosition.current = 0;  // Reset scroll position for a seamless loop
      }
    }
  };

  // Use interval for auto-scroll
  useEffect(() => {
    const interval = setInterval(startContinuousScroll, 20); // Adjust speed by changing the interval

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [brands]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover <Text style={styles.highlight}>Our Brands</Text></Text>
      <Text style={styles.subtitle}>Explore the top brands we feature in our store</Text>
      
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16} // Controls scroll event frequency
        style={styles.brandList}
      >
        {/* Render the brands twice to create a continuous loop effect */}
        {[...brands, ...brands].map((brand, index) => (
          <View key={index} style={styles.brandContainer}>
            <Image
              source={{ uri: `${ApiImages}/images/brand/${brand.thumbnail}` }}
              style={styles.brandImage}
            />
            <Text style={styles.brandName}>{brand.name}</Text>
            <Text style={styles.brandDescription}>
              {brand.description || "No description available."}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    color: '#4A90E2',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  brandList: {
    flexDirection: 'row',
  },
  brandContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    width: width * 0.6, // Ensure each brand takes up 60% of screen width for easy readability
  },
  brandImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  brandDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  noBrands: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Brands;
