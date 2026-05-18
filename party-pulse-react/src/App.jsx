import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MatchNotificationProvider } from './context/MatchNotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgeGate from './components/AgeGate';
import AnimatedRoutes from './components/AnimatedRoutes';
import PartyBackground from './components/3d/PartyParticles';
import ScrollBackground3D from './components/3d/ScrollBackground3D';
import MatchToastContainer from './components/MatchToastContainer';
import ScrollToTop from './components/ScrollToTop';
import './App.css'; // Global CSS a App.css-ből
import './index.css'; // További globális CSS az index.css-ből

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <MatchNotificationProvider>
                    <div className="app-wrapper">
                        <PartyBackground />
                        <ScrollBackground3D />
                        <AgeGate />
                        <Navbar />
                        <MatchToastContainer />
                        <main>
                            <AnimatedRoutes />
                        </main>
                        <Footer />
                    </div>
                </MatchNotificationProvider>
            </Router>
        </AuthProvider>
    );
}

export default App;