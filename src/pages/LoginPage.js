import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSuccess = (response) => {
        console.log('Login Success:', response);
        login();
        navigate('/dashboard');
    };

    const handleLoginError = (error) => {
        console.log('Login Error:', error);
    };

    return (
        <div>
            <h2>Login with Google</h2>
            <GoogleLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
        </div>
    );
};

export default LoginPage;
