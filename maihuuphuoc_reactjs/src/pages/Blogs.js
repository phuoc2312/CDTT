import React, { useEffect, useState } from 'react';
import TopicService from '../Service/TopicService';
import Footer from '../components/footer';
import Header from '../components/header';
import { useNavigate } from 'react-router-dom'; 
function Blogs() {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const result = await TopicService.getList();
        setTopics(result.topics);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError(err);
      }
    })();
  }, []);
  const handleReadMore = (topicId) => {
    navigate(`/post/${topicId}`); // Điều hướng đến trang post theo id của topic
  };
  return (
    <div>
      <Header/>
      <section className="py-16 bg-gray-50">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Discover <span className="text-primary">Our</span> Blog
          </h2>
          <p className="my-7 text-lg text-gray-600">
            Stay updated with the latest trends, tips, and stories in the world of fashion
          </p>
        </div>
        <div className="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl">
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {topics.length > 0 ? (
              topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className="flex flex-col p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <h1 className="mb-4 text-2xl font-semibold text-gray-900 leading-tight tracking-wide uppercase">
                    {topic.name}
                  </h1>
                  <p className="flex-grow text-base font-medium text-gray-600 leading-relaxed mb-6">
                    {topic.description}
                  </p>
                   <div className="mt-auto">
                    <button
                      onClick={() => handleReadMore(topic.id)} // Gọi hàm điều hướng
                      className="block text-center bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-6 rounded-full transition-colors duration-300"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No blogs available</p>
            )}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

export default Blogs;
