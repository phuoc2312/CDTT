import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Để điều hướng trong React Native
import UserService from '../../../Service/UserService'; // Thêm import cho UserService
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Sử dụng navigation để điều hướng

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const response = await UserService.login({ username, password });
      const token = response.token;
      const userId = response.user.id;
      const name = response.user.name;

      if (token) {
        // Sử dụng AsyncStorage để lưu trữ token và thông tin người dùng
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('name', name);

        // Nếu bạn cần lưu vào localStorage trong một ứng dụng web, bạn có thể làm như sau
        // localStorage.setItem('authToken', token);
        // localStorage.setItem('userId', userId);
        // localStorage.setItem('name', name);

        // Chuyển hướng sau khi đăng nhập thành công
        navigation.navigate('Home'); // Sử dụng navigation để chuyển hướng trong React Native
      } else {
        setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error) {
      setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity style={styles.checkbox} />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 10,
  },
  rememberMeText: {
    fontSize: 16,
  },
  forgotPasswordText: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    fontSize: 16,
  },
  registerButtonText: {
    color: '#007bff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default Login;
