import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ComingSoon from './pages/ComingSoon';
import AnalyzeResume from './pages/AnalyzeResume';
import GenerateCoverLetter from './pages/GenerateCoverLetter';
import MyDocuments from './pages/MyDocuments';
import MyProfile from './pages/MyProfile';
import FeedbackAndReviews from './pages/FeedbackAndReviews';
import History from './pages/History';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import comingSoonImage from './assets/coming-soon-3d.png';

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
                        path="/events"
                        element={
                            <ProtectedRoute>
                                <ComingSoon featureName="Tech Events and Hackathons Near Me" />
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
                    <Route path="/my-profile" element={
                        <ProtectedRoute>
                            <MyProfile />
                        </ProtectedRoute>
                    } />
                    <Route path="/feedback-and-reviews" element={<ProtectedRoute>
                        <FeedbackAndReviews />
                    </ProtectedRoute>} />
                    <Route path="/history" element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;