import React, { useState, useEffect } from 'react';
import { FaUndoAlt, FaTrash } from 'react-icons/fa'; // Import the trash icon
import CategoryService from '../../Service/CategoryService'; // Service cho danh mục
import BrandService from '../../Service/BrandService'; // Service cho thương hiệu
import BannerService from '../../Service/BannerService'; // Service cho banner
import TopicService from '../../Service/TopicService'; // Service cho topic
import PostService from '../../Service/PostService'; // Service cho bài viết (post)
import Header from '../../components/header'; // Component Header
import OrderService from '../../Service/OrderService';
import MenuService from '../../Service/MenuService';

const RecycleBin = () => {
  const [activeTab, setActiveTab] = useState('categories'); // State để theo dõi tab đang chọn
  const [deletedItems, setDeletedItems] = useState([]); // State để lưu các mục đã xóa

  // Gọi API lấy dữ liệu tương ứng với tab được chọn
  useEffect(() => {
    fetchDeletedItems();
  }, [activeTab]);

  const fetchDeletedItems = async () => {
    try {
      let result;
      switch (activeTab) {
        case 'categories':
          result = await CategoryService.getDeleted();
          break;
        case 'brands':
          result = await BrandService.getDeleted();
          break;
        case 'banners':
          result = await BannerService.getDeleted();
          break;
        case 'topics':
          result = await TopicService.getDeleted();
          break;
        case 'post':
          result = await PostService.getDeleted();
          break;
        case 'order':
          result = await OrderService.getDeleted();
          break;
          case 'menu':
            result = await MenuService.getDeleted();
            break;
        default:
          return; // or setDeletedItems([]) to avoid confusion
      }

      // Log the entire result for debugging
      console.log('API Response:', result);

      // Check for the specific item types based on the response
      if (result) {
        if (Array.isArray(result)) {
          setDeletedItems(result); // Set deleted items directly if it's an array
        } else if (result.categories) {
          setDeletedItems(result.categories);
        } else if (result.brands) {
          setDeletedItems(result.brands);
        } else if (result.banners) {
          setDeletedItems(result.banners);
        } else if (result.topics) {
          setDeletedItems(result.topics);
        } else if (result.posts) {
          setDeletedItems(result.posts);
        } else if (result.order) {
          setDeletedItems(result.order);
        } else if (result.menu) {
          setDeletedItems(result.menu);
        }
      } else {
        console.error('No deleted items found');
        setDeletedItems([]);
      }
    } catch (error) {
      console.error('Error fetching deleted items:', error);
      setDeletedItems([]); // Ensure to clear items on error
    }
  };


  // Hàm khôi phục mục đã xóa
  const handleRestoreItem = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục mục này không?')) {
      try {
        switch (activeTab) {
          case 'categories':
            await CategoryService.restore(id);
            break;
          case 'brands':
            await BrandService.restore(id);
            break;
          case 'banners':
            await BannerService.restore(id);
            break;
          case 'topics':
            await TopicService.restore(id);
            break;
          case 'post':
            await PostService.restore(id);
            break;
          case 'order':
            await OrderService.restore(id);
            break;
            case 'menu':
            await MenuService.restore(id);
            break;
          default:
            break;
        }
        setDeletedItems(deletedItems.filter((item) => item.id !== id));
        alert('Khôi phục thành công.');
      } catch (error) {
        console.error('Error restoring item:', error);
        alert('Khôi phục không thành công.');
      }
    }
  };

  // Hàm xóa vĩnh viễn mục đã xóa
  const handlePermanentDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn mục này không?')) {
      try {
        switch (activeTab) {
          case 'categories':
            await CategoryService.forceDelete(id); // Xóa vĩnh viễn danh mục
            break;
          case 'brands':
            await BrandService.forceDelete(id); // Xóa vĩnh viễn thương hiệu
            break;
          case 'banners':
            await BannerService.forceDelete(id); // Xóa vĩnh viễn banner
            break;
          case 'topics':
            await TopicService.destroy(id); // Xóa vĩnh viễn topic
            break;
          case 'post':
            await PostService.destroy(id); // Xóa vĩnh viễn bài viết
            break;
          case 'order':
            await OrderService.destroy(id); // Xóa vĩnh viễn bài viết
            break;
            case 'menu':
            await MenuService.destroy(id); // Xóa vĩnh viễn bài viết
            break;
          default:
            break;
        }
        setDeletedItems(deletedItems.filter((item) => item.id !== id));
        alert('Xóa vĩnh viễn thành công.');
      } catch (error) {
        console.error('Error deleting item permanently:', error);
        alert('Lỗi khi xóa đơn hàng: ' + error.response.data.message); 
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Thùng Rác</h1>
        <div className="tabs mb-6 flex space-x-4">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded ${activeTab === 'categories' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Category
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2 rounded ${activeTab === 'brands' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Brand
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded ${activeTab === 'banners' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Banner
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded ${activeTab === 'topics' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Topic
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 rounded ${activeTab === 'post' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Post
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`px-4 py-2 rounded ${activeTab === 'order' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Order
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded ${activeTab === 'menu' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Menu
          </button>
        </div>
        {deletedItems.length === 0 ? (
          <p className="text-gray-600">Không có mục nào trong thùng rác cho danh mục đã chọn.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deletedItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-md">
                <h2 className="text-lg font-semibold text-gray-800">{item.name || item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleRestoreItem(item.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                  >
                    <FaUndoAlt className="mr-2" /> Khôi Phục
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                  >
                    <FaTrash className="mr-2" /> Xóa Vĩnh Viễn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RecycleBin;
