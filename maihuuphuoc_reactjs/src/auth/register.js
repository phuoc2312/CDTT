import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';

function Register() {
    const [name, setName] = useState('');
    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [passwordconfirmation, setpasswordconfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = 'http://127.0.0.1:8000/api/user/register';
        const payload = { name, username, email, phone, address, gender, password, passwordconfirmation };

        if (password !== passwordconfirmation) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(url, payload);

            if (response.data.status) {
                localStorage.setItem('token', response.data.access_token);
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
            <Header />
            <section id="register-login-page" className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Register Form */}
                        <div className="md:w-1/2 bg-white rounded-lg shadow-md p-8 ml-60">
                            <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
                            <form onSubmit={handleAuth}>
                                {error && (
                                    <p className="text-red-500 mb-4 text-center">{error}</p>
                                )}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        required969
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setusername(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
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
                                <div className="mb-4">
                                    <label htmlFor="password-confirmation" className="block text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="password-confirmation"
                                        value={passwordconfirmation}
                                        onChange={(e) => setpasswordconfirmation(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full w-full"
                                >
                                    {loading ? 'Loading...' : 'Register'}
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

export default Register;
