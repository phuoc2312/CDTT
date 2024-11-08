import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../Service/UserService';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            setErrorMessage('Vui lòng nhập tên đăng nhập và mật khẩu.');
            return;
        }
    
        setLoading(true);
    
        try {
            // Gọi API đăng nhập
            const response = await UserService.login({ username, password });
            
            // Kiểm tra phản hồi API
            console.log('Full API response:', response); // Xem dữ liệu trả về từ API
    
            // Kiểm tra dữ liệu
            if (!response || !response.token || !response.user) {
                throw new Error('Không nhận được phản hồi đúng từ server.');
            }
    
            const { token, user } = response;
    
            // Kiểm tra vai trò của user
            if (user.roles !== 'admin') {
                throw new Error('Chỉ tài khoản admin mới có quyền đăng nhập.');
            }
    
            // Lưu thông tin người dùng và token vào localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('name', user.name);
    
            // Tiến hành login thành công
            onLogin();
            navigate('/');
        } catch (error) {
            // Xử lý lỗi
            setErrorMessage(error.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <section id="register-login-page" className="bg-gray-100 py-16">
                <div className="container mx-auto px-10">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/2 bg-white rounded-lg shadow-md p-8 ml-60">
                            <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
                            <form onSubmit={handleLogin}>
                                {errorMessage && (
                                    <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
                                )}
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="remember-me" className="mr-2" />
                                    <label htmlFor="remember-me" className="text-gray-700">Remember Me</label>
                                </div>
                                <div className="mb-4 text-center">
                                    <Link to="/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary text-black border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full w-full"
                                >
                                    {loading ? 'Loading...' : 'Login'}
                                </button>
                                <div className="mt-4 text-center">
                                    <span className="text-gray-700">Don't have an account? </span>
                                    <Link to="/register" className="text-primary hover:underline">
                                        Register here
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;

