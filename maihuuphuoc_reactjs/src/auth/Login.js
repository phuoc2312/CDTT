import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import UserService from '../Service/UserService'; // Thêm import cho UserService

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage('Vui lòng nhập tên đăng nhập và mật khẩu.');
            return;
        }

        setLoading(true); // Bắt đầu loading

        try {
            const response = await UserService.login({ username, password });
            const token = response.token;
            const userId = response.user.id;
            const name = response.user.name;
            console.log(response);

            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('name', name);
            window.location.href = '/'; // Chuyển hướng sau khi đăng nhập thành công
        } catch (error) {
            setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
            console.error('Error logging in:', error);
        } finally {
            setLoading(false); // Kết thúc loading
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
                                {errorMessage && ( // Sửa từ error thành errorMessage
                                    <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
                                )}
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700">Username</label>
                                    <input
                                        type="text" // Sửa type từ "username" thành "text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)} // Sửa setusername thành setUsername
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
                                    disabled={loading} // Vô hiệu hóa nút khi loading
                                    className="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full w-full"
                                >
                                    {loading ? 'Loading...' : 'Login'} {/* Hiển thị thông báo loading */}
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
