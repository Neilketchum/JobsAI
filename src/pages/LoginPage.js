import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { setUser } = useUser();

    const handleLoginSuccess = (response) => {
        const decodedToken = jwtDecode(response.credential);
        console.log("User Info:", decodedToken);

        const userEmail = decodedToken.email;
        const userProfilePicture = decodedToken.picture;
        const name = decodedToken.name;

        console.log("Decoded Token :-" + decodedToken);
        
        axios.post('http://localhost:8080/profile', { email: userEmail, name: name, profilePicture: userProfilePicture })
            .then((response) => {
                console.log('Profile created:', response.data); // Log the response data
            })
            .catch((error) => {
                console.error('Error creating profile:', error);
            }); 

        setUser({ email: userEmail });
        login();
        console.log(response);
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
