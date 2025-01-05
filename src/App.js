import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzeResume from './pages/AnalyzeResume';
import GenerateCoverLetter from './pages/GenerateCoverLetter';
import MyDocuments from './pages/MyDocuments';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    console.log('Environment:', process.env);
    console.log('Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

    const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/analyze-resume" 
                        element={
                            <ProtectedRoute>
                                <AnalyzeResume />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/generate-cover-letter" 
                        element={
                            <ProtectedRoute>
                                <GenerateCoverLetter />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/my-documents" 
                        element={
                            <ProtectedRoute>
                                <MyDocuments />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;