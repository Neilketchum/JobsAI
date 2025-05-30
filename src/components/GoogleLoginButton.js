import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError }) => {
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
        />
    );
};

export default GoogleLoginButton;
