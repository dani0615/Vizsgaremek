import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Ranking from './pages/Ranking';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css'; // Global CSS a App.css-ből
import './index.css'; // További globális CSS az index.css-ből

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* További route-ok, ha szükséges */}
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;