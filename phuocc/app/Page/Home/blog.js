import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopicService from '../../Service/TopicService';

function Blogs() {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const result = await TopicService.getList();
        setTopics(result.topics);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError(err);
      }
    };
    fetchTopics();
  }, []);

  const handleReadMore = (topicId) => {
    navigation.navigate('PostsByTopic', { topicId }); // Navigate to the post screen
  };

  const renderTopicItem = ({ item }) => (
    <View style={styles.topicContainer}>
      <Text style={styles.topicTitle}>{item.name}</Text>
      <Text style={styles.topicDescription}>{item.description}</Text>
      <TouchableOpacity onPress={() => handleReadMore(item.id)} style={styles.readMoreButton}>
        <Text style={styles.readMoreText}>Read more</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Discover <Text style={styles.primaryText}>Our</Text> Blog
          </Text>
          <Text style={styles.headerSubtitle}>
            Stay updated with the latest trends, tips, and stories in the world of fashion
          </Text>
        </View>
        <FlatList
          data={topics}
          renderItem={renderTopicItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.topicList}
          numColumns={1}
        />
        {topics.length === 0 && <Text style={styles.noTopicsText}>No blogs available</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  primaryText: {
    color: '#2563EB',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  topicList: {
    paddingBottom: 20,
  },
  topicContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3, // For Android shadow
  },
  topicTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  topicDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  readMoreButton: {
    backgroundColor: '#2563EB',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noTopicsText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
  },
});

export default Blogs;
