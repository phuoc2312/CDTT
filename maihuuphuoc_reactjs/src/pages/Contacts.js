import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import ConfigService from '../Service/ConfigService';
import ContactService from '../Service/ContactService'; // Import dịch vụ liên hệ

function Contacts() {
  const [configs, setConfigs] = useState([]);
  const [formData, setFormData] = useState({
    title: "", // Đổi từ name thành title
    content: "", // Đổi từ message thành content
  });
  const [responseMessage, setResponseMessage] = useState(""); // Để hiển thị phản hồi từ API

  useEffect(() => {
    (async () => {
      try {
        const result = await ConfigService.getList(); // Gọi dịch vụ để lấy danh sách cấu hình
        if (Array.isArray(result)) {
          setConfigs(result);
        } else {
          console.error("Kết quả không phải là một mảng:", result);
          setConfigs([]);
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
        setConfigs([]);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo object formData để gửi
    const formDataToSend = {
      user_id: localStorage.getItem('userId'), // Lấy user_id từ localStorage
      title: formData.title,
      content: formData.content,
    };

    try {
      // Sử dụng ContactService để gửi thông tin
      const response = await ContactService.createContact(formDataToSend);

      // Đảm bảo phản hồi từ API có message
      if (response.data && response.data.message) {
        setResponseMessage(response.data.message); // Hiển thị thông báo thành công
      } else {
        setResponseMessage('Liên hệ đã được gửi thành công, Chúng tôi sẽ sớm phản hồi.');
      }

      // Reset form sau khi gửi thành công
      setFormData({ title: "", content: "" });
    } catch (error) {
      const errorMessage = error.response && error.response.data
        ? error.response.data.message
        : 'Đã xảy ra lỗi khi gửi liên hệ.';

      console.error('Error submitting contact form:', error);
      setResponseMessage(errorMessage);
    }
  };


  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {configs && configs.length > 0 ? (
                configs.map((config) => (
                  <div key={config.id}>
                    <h2 className="text-2xl font-semibold">Our Contact Information</h2>
                    <p className="text-gray-600">
                      Feel free to reach out to us through the contact form or by using the details below.
                    </p>

                    <div>
                      <h3 className="text-lg font-medium">Address</h3>
                      <p className="text-gray-700">{config.address}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Phone</h3>
                      <p className="text-gray-700">{config.phone}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Email</h3>
                      <p className="text-gray-700">{config.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No configs found</p>
              )}
            </div>

            {/* Contact Form Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Send Us a Message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows="4"
                    placeholder="Enter your message"
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full"
                  >
                    Send Message
                  </button>
                </div>
              </form>

              {/* Display response message */}
              {responseMessage && <p className="text-center mt-4">{responseMessage}</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contacts;
