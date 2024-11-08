import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Trạng thái checkbox isAdmin
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = 'http://127.0.0.1:8000/api/user/register';
        const payload = {
            name,
            username,
            email,
            phone,
            address,
            gender,
            password,
            password_confirmation,
            roles: isAdmin ? 'admin' : 'customer', // Đặt roles là 'admin' nếu checkbox được chọn
        };

        if (password !== password_confirmation) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(url, payload);

            if (response.status === 201) {
                // Lưu token và điều hướng tới trang chủ sau khi đăng ký thành công
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', username);
                navigate('/');
            } else {
                setError(response.data.message || 'Có lỗi xảy ra từ API');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Vui lòng thử lại.';
            setError(`Đã xảy ra lỗi: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section id="register-login-page" className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2 bg-white rounded-lg shadow-md p-8 ml-60">
                            <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
                            <form onSubmit={handleAuth}>
                                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="gender" className="block text-gray-700">Gender</label>
                                    <input
                                        type="text"
                                        id="gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password-confirmation" className="block text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="password-confirmation"
                                        value={password_confirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isAdmin"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="isAdmin" className="text-gray-700">Register as Admin</label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary text-black border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full w-full"
                                >
                                    {loading ? 'Loading...' : 'Register'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Register;
