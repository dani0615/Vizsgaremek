import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgeGate from './components/AgeGate';
import AnimatedRoutes from './components/AnimatedRoutes';
import PartyBackground from './components/3d/PartyParticles';
import './App.css'; // Global CSS a App.css-ből
import './index.css'; // További globális CSS az index.css-ből

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-wrapper">
                    <PartyBackground />
                    <AgeGate />
                    <Navbar />
                    <main>
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;