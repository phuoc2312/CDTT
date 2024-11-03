import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import TopicService from '../../../Service/TopicService';
import { ApiImages } from '../../../Api/ApiImages';

function PostsByTopic() {
  const route = useRoute();
  const { topicId } = route.params;
  const [posts, setPosts] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const result = await TopicService.getId(topicId);
        console.log('API response:', result);
        if (result.data && result.data.length > 0) {
          setPosts(result.data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTopic = async () => {
      try {
        const topicResponse = await TopicService.getId(topicId);
        if (topicResponse.data && topicResponse.data.length > 0) {
          setTopicName(topicResponse.data[0].name);
        } else {
          setTopicName('');
        }
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };

    fetchPosts();
    fetchTopic();
  }, [topicId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.topicTitle}>{topicName}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : error ? (
          <Text style={styles.errorText}>Failed to load posts: {error}</Text>
        ) : posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <View key={item.id} style={styles.postContainer}>
                <Image
                  source={{ uri: `${ApiImages}/images/post/${item.thumbnail}` }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.postContent}>
                  <Text style={styles.postTitle}>{item.title}</Text>
                  <Text style={styles.postText}>{item.content}</Text>
                  <Text style={styles.postDate}>
                    Published on: {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.postsList}
          />
        ) : (
          <Text style={styles.noPostsText}>No posts available for this topic.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Equivalent to bg-gray-50
  },
  scrollContainer: {
    padding: 16,
  },
  topicTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#1F2937', // Equivalent to text-gray-900
  },
  postContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    borderColor: '#D1D5DB', // Equivalent to border-gray-300
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF', // Equivalent to bg-white
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5, // Android shadow
  },
  thumbnail: {
    width: '40%',
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Equivalent to text-gray-900
  },
  postText: {
    fontSize: 16,
    color: '#4B5563', // Equivalent to text-gray-700
    marginBottom: 4,
  },
  postDate: {
    fontSize: 12,
    color: '#6B7280', // Equivalent to text-gray-500
    alignSelf: 'flex-end',
  },
  errorText: {
    color: '#F87171', // Equivalent to text-red-500
    textAlign: 'center',
  },
  noPostsText: {
    textAlign: 'center',
    color: '#9CA3AF', // Equivalent to text-gray-500
  },
});

export default PostsByTopic;
