import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Api from '../../../Api/Api';
function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation(); // Khai báo navigation

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = `${Api}/user/register`; // Thay địa chỉ IP nếu cần
        const payload = { name, username, email, phone, address, gender, password, password_confirmation };

        if (password !== password_confirmation) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(url, payload);

            console.log('Response:', response); // Log response để kiểm tra
            if (response.status === 201) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('username', username);
                navigation.navigate('Login'); // Chuyển hướng về trang Login
            } else {
                setError(response.data.message || 'Có lỗi xảy ra từ API');
            }
        } catch (error) {
            console.log('Error:', error); // Log lỗi để kiểm tra
            const errorMsg = error.response?.data?.message || error.message || 'Vui lòng thử lại.';
            setError(`Đã xảy ra lỗi: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Register</Text>
            {error && (
                <Text style={styles.error}>{error}</Text>
            )}
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                required
            />
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                required
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                required
            />
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                required
            />
            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
                required
            />
            <TextInput
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                required
            />
            <TextInput
                placeholder="Confirm Password"
                value={password_confirmation}
                onChangeText={setPasswordConfirmation}
                style={styles.input}
                secureTextEntry
                required
            />
            <Button
                title={loading ? 'Loading...' : 'Register'}
                onPress={handleAuth}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default Register;
