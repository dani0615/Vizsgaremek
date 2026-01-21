import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Ranking from './pages/Ranking';
import Login from './pages/Login';
import './App.css'; // Global CSS a App.css-ből
import './index.css'; // További globális CSS az index.css-ből

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/login" element={<Login />} />
                {/* További route-ok, ha szükséges */}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;