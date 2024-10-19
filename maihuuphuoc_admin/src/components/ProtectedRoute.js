import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('authToken'); // Kiểm tra xem có token đăng nhập hay không

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Nếu chưa đăng nhập, chuyển hướng tới login
    }

    return children; // Nếu đã đăng nhập, hiển thị nội dung bên trong
};

export default ProtectedRoute;
