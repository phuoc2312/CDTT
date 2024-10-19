import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopicService from '../Service/TopicService';
import { ApiImages } from '../Api/ApiImages';
import Header from '../components/header';
import Footer from '../components/footer';
function PostsByTopic() {
  const { topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Fetch posts for the specific topic
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
          // Set the topic name based on the fetched data
          setTopicName(topicResponse.data[0].name);
        } else {
          setTopicName(''); // Reset if no topic found
        }
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };

    fetchPosts();
    fetchTopic(); // Fetch the topic information

  }, [topicId]);

  return (
    <div><Header />
      <div className="container mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">{topicName}</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Failed to load posts: {error}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="flex mb-6 p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <img
                src={`${ApiImages}/images/post/${post.thumbnail}`}
                className="w-1/3 h-56 object-cover rounded-lg mr-4"
                alt={post.title}
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <p className="text-sm text-gray-500">Published on: {new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No posts available for this topic.</p>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default PostsByTopic;
