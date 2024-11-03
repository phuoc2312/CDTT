import React, { useEffect, useState } from 'react';  
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';  
import { useNavigation } from '@react-navigation/native';
import CategoryService from '../../../Service/CategoryService';  
import { ApiImages } from './../../../Api/ApiImages';  

function Category() {  
  const [categories, setCategories] = useState([]);  
  const navigation = useNavigation();

  useEffect(() => {  
    const fetchCategories = async () => {  
      try {  
        const result = await CategoryService.getList();  
        if (result && result.categories) {  
          setCategories(result.categories);  
        }  
      } catch (error) {  
        console.error('Error fetching categories:', error);  
      }  
    };  

    fetchCategories();  
  }, []);  

  // Handle navigation to the products list of the selected category
  const handleCategoryPress = (category_id, category_name) => {
    navigation.navigate('ProductsByCategory', { category_id, category_name });
  };

  return (  
    <View style={styles.container}>  
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>  
        {categories.map((category) => (  
          <View key={category.id} style={styles.categoryContainer}>  
            <TouchableOpacity 
              style={styles.categoryBanner} 
              onPress={() => handleCategoryPress(category.id, category.name)}
            >  
              <Image  
                source={{  
                  uri: category.thumbnail  
                    ? `${ApiImages}/images/category/${category.thumbnail}`  
                    : 'https://via.placeholder.com/100', // Default image  
                }}  
                style={styles.image}  
                resizeMode="contain"  
              />  
              <Text style={styles.categoryName}>{category.name}</Text>  
            </TouchableOpacity>  
          </View>  
        ))}  
      </ScrollView>  
    </View>  
  );  
}  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    paddingVertical: 10,  
    backgroundColor: '#fff',  
  },  
  scrollView: {  
    paddingHorizontal: 10,  
  },  
  categoryContainer: {  
    width: 100, 
    marginRight: 10,  
    alignItems: 'center',  
  },  
  categoryBanner: {  
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: '#f8f8f8', 
    borderRadius: 10, 
    padding: 10,  
    elevation: 2, 
  },  
  image: {  
    width: 60, 
    height: 60,  
  },  
  categoryName: {  
    fontSize: 12, 
    fontWeight: 'bold',  
    color: '#000',  
    textAlign: 'center',  
    marginTop: 5, 
  },  
});  

export default Category;
