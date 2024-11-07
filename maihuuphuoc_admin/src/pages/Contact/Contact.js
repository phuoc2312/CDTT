import React, { useEffect, useState } from 'react';
import ContactService from '../../Service/ContactService';

function Contact() {
  // State để lưu danh sách thông tin liên hệ, mặc định là một mảng rỗng
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContactService.getList()
      .then((response) => {
        console.log("Dữ liệu trả về từ API:", response);  // In toàn bộ response để kiểm tra
        if (response && Array.isArray(response.data)) {
          setContacts(response.data);  // Nếu đúng mảng thì set vào state
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", response);  // Thông báo nếu không phải mảng
          setContacts([]);  // Nếu không hợp lệ, set là mảng rỗng
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi tải dữ liệu liên hệ:', error);
        setLoading(false);
      });
  }, []);
  
  
  // Hàm xử lý trả lời liên hệ
  const handleReply = (id) => {
    const replyData = prompt("Nhập nội dung phản hồi:");
    if (replyData) {
      ContactService.sendReply(id, { message: replyData })
        .then(() => {
          alert("Phản hồi đã được gửi thành công!");
          // Cập nhật lại danh sách liên hệ sau khi phản hồi
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.id === id
                ? { ...contact, replyStatus: 'Đã phản hồi' } // Giả sử có trường "replyStatus"
                : contact
            )
          );
        })
        .catch((error) => console.error("Lỗi khi gửi phản hồi:", error));
    }
  };

  // Hàm xử lý xóa liên hệ
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
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Quản Lý Thông Tin Liên Hệ</h1>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        {loading ? (
          <p className="text-center text-lg text-gray-600 py-4">Đang tải dữ liệu...</p>
        ) : contacts.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">Tiêu đề</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">Nội dung</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">Ngày gửi</th>
                <th className="py-3 px-6 text-center font-semibold text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 border-b border-gray-200">{contact.title}</td> {/* Hiển thị tiêu đề */}
                  <td className="py-4 px-6 border-b border-gray-200">{contact.content}</td> {/* Hiển thị nội dung */}
                  <td className="py-4 px-6 border-b border-gray-200">
                    {/* Giả sử không có trường 'date', có thể thay thế bằng 'created_at' hoặc trường thời gian khác */}
                    {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'Chưa có ngày'}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                      onClick={() => handleReply(contact.id)}
                    >
                      Trả lời
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
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
    </div>
  );
}

export default Contact;
