import React, { useState, useEffect } from 'react';
import UserService from '../../Service/UserService';

const AccountSettings = () => {
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '', // Avatar file state
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(''); // Preview for avatar image

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            UserService.show(userId)
                .then(data => {
                    setUserInfo({
                        username: data.username || '',
                        email: data.email || '',
                        password: '',
                        confirmPassword: '',
                        avatar: data.avatar || '', // Set avatar state
                    });
                    setAvatarPreview(data.avatar);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to load user information');
                    setIsLoading(false);
                });
        } else {
            setError('No user found in localStorage');
            setIsLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setUserInfo({
                ...userInfo,
                avatar: file, // Save the file to state
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (userInfo.password !== userInfo.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData = new FormData();
        formData.append('username', userInfo.username);
        formData.append('email', userInfo.email);
        formData.append('password', userInfo.password);
        formData.append('confirmPassword', userInfo.confirmPassword);
        formData.append('avatar', userInfo.avatar);

        // Log formData to check its content
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Gọi API để gửi dữ liệu lên server
        const userId = localStorage.getItem('userId');
        if (userId) {
            UserService.update(formData, userId)
                .then(response => {
                    alert('Account settings updated!');
                })
                .catch(error => {
                    console.error(error.response); // Log lỗi chi tiết
                    setError('Failed to update account settings');
                });
        } else {
            setError('No user found in localStorage');
        }
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 text-center">
                    <div className="inline-block relative">
                        <img
                            src={avatarPreview || '/default-avatar.png'}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1 cursor-pointer opacity-0"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Click to change avatar</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={userInfo.username}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={userInfo.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountSettings;
