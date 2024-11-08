import React, { useState, useEffect } from 'react';
import ContactService from '../../Service/ContactService';

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(null);

  // Lấy danh sách liên hệ từ API khi component được mount
  useEffect(() => {
    ContactService.getList()
      .then((response) => {
        console.log("Dữ liệu trả về từ API:", response); // In toàn bộ response để kiểm tra

        // Kiểm tra nếu response là một mảng hợp lệ
        if (Array.isArray(response) && response.length > 0) {
          setContacts(response);  // Nếu là mảng hợp lệ, set vào state
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", response);  // Thông báo nếu không phải mảng hợp lệ
          setContacts([]);  // Nếu không hợp lệ, set là mảng rỗng
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi tải dữ liệu liên hệ:', error);
        setLoading(false);  // Dừng trạng thái loading khi có lỗi
      });
  }, []);

  const handleReply = (id) => {
    setSelectedContactId(id);
    setIsModalOpen(true); // Mở modal khi bấm nút "Trả lời"
  };

  const handleReplySubmit = () => {
    if (replyContent.trim() === '') {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    ContactService.sendReply(selectedContactId, { message: replyContent })
      .then(() => {
        // Thông báo phản hồi đã được gửi thành công
        alert("Đã gửi phản hồi thành công!");

        // Cập nhật lại danh sách liên hệ sau khi phản hồi
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === selectedContactId
              ? { ...contact, replyStatus: 'Đã phản hồi' } // Cập nhật trạng thái phản hồi
              : contact
          )
        );

        setIsModalOpen(false); // Đóng modal sau khi gửi
        setReplyContent(''); // Reset nội dung phản hồi
      })
      .catch((error) => {
        console.error("Lỗi khi gửi phản hồi:", error);
        alert('Có lỗi xảy ra, vui lòng thử lại.');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) {
      ContactService.deleteContact(id)
        .then(() => {
          alert("Liên hệ đã được chuyển vào thùng rác!");
          // Cập nhật lại danh sách liên hệ sau khi xóa
          setContacts((prevContacts) =>
            prevContacts.filter((contact) => contact.id !== id)
          );
        })
        .catch((error) => console.error("Lỗi khi xóa liên hệ:", error));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản Lý Thông Tin Liên Hệ</h1>

      <div className="overflow-x-auto bg-white shadow-md sm:rounded-lg p-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-t-4 border-blue-500 rounded-full"></div>
            <span className="ml-4 text-xl text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : contacts.length > 0 ? (
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="py-3 px-6 font-medium">Tiêu đề</th>
                <th className="py-3 px-6 font-medium">Nội dung</th>
                <th className="py-3 px-6 font-medium">Ngày gửi</th>
                <th className="py-3 px-6 font-medium">Trạng thái</th> {/* Cột trạng thái */}
                <th className="py-3 px-6 text-center font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-all duration-200 ease-in-out">
                  <td className="py-4 px-6 border-b">{contact.title}</td>
                  <td className="py-4 px-6 border-b">{contact.content}</td>
                  <td className="py-4 px-6 border-b">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <span className={`py-1 px-3 rounded-full text-white ${contact.replyStatus === 'Đã phản hồi' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {contact.replyStatus === 'Đã phản hồi' ? 'Đã phản hồi' : 'Chưa phản hồi'}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded mr-2 transition-all duration-200 ease-in-out"
                      onClick={() => handleReply(contact.id)}
                    >
                      Trả lời
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded transition-all duration-200 ease-in-out"
                      onClick={() => handleDelete(contact.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-lg text-gray-600 py-4">Không có dữ liệu liên hệ.</p>
        )}
      </div>

      {/* Modal trả lời */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Trả lời liên hệ</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Nhập nội dung phản hồi..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="mt-4 text-right">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleReplySubmit}
              >
                Gửi Phản Hồi
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
