import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="logo"><NavLink to="/">PARTY<span>PULSE</span></NavLink></div>
            <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links">
                <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Kezdőlap</NavLink></li>
                <li><NavLink to="/events" onClick={() => setIsMobileMenuOpen(false)}>Bulik</NavLink></li>
                <li><NavLink to="/ranking" onClick={() => setIsMobileMenuOpen(false)}>Ranglista</NavLink></li>
                <li><NavLink to="/login" className="btn-neon-outline" onClick={() => setIsMobileMenuOpen(false)}>Belépés</NavLink></li>
            </ul>
            <div className="menu-toggle" onClick={toggleMobileMenu}>
                <i className="fas fa-bars"></i>
            </div>
        </nav>
    );
};

export default Navbar;