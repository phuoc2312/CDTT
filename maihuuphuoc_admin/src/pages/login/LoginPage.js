import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Dùng axios để gọi API

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Gọi API để xác thực thông tin đăng nhập
            const response = await axios.post('/api/auth/login', {
                username,
                password
            });

            const { token, roles } = response.data;

            // Kiểm tra vai trò của người dùng
            if (roles === 'admin') {
                // Lưu token và role vào localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('roles', roles);

                // Chuyển hướng đến trang dashboard
                navigate('/dashboard');
            } else {
                setErrorMessage('Bạn không có quyền truy cập trang này');
            }
        } catch (error) {
            // Nếu có lỗi (như sai username/password), hiển thị thông báo
            setErrorMessage('Sai thông tin đăng nhập');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Đăng nhập</button>
        </div>
    );
};

export default LoginPage;
