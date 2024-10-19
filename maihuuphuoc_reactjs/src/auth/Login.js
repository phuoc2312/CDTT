import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = `http://127.0.0.1:8000/api/user/login`; // URL của API đăng nhập
        const payload = { email, password }; // Dữ liệu gửi đi

        try {
            const response = await axios.post(url, payload); // Gọi API

            if (response.data.status) {
                // Nếu đăng nhập thành công, lưu token và username từ phản hồi API
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('username', response.data.username); // Lưu username thay vì email
                navigate('/'); // Điều hướng về trang chủ
            } else {
                // Nếu đăng nhập thất bại, hiển thị thông báo lỗi
                setError(response.data.message || 'Có lỗi xảy ra từ API');
            }
        } catch (error) {
            // Xử lý lỗi từ phía API hoặc mạng
            const errorMsg = error.response?.data?.message || error.message || 'Vui lòng thử lại.';
            setError(`Đã xảy ra lỗi: ${errorMsg}`);
        } finally {
            // Kết thúc quá trình và tắt trạng thái loading
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <section id="register-login-page" className="bg-gray-100 py-16">
                <div className="container mx-auto px-10">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Login Form */}
                        <div className="md:w-1/2 bg-white rounded-lg shadow-md p-8 ml-60">
                            <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
                            <form onSubmit={handleLogin}>
                                {error && (
                                    <p className="text-red-500 mb-4 text-center">{error}</p>
                                )}
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    className="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full w-full"
                                >
                                    {loading ? 'Loading...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Login;
