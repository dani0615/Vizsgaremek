import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="logo"><NavLink to="/">PARTY<span>PULSE</span></NavLink></div>
            <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links">
                <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Kezdőlap</NavLink></li>
                <li><NavLink to="/events" onClick={() => setIsMobileMenuOpen(false)}>Bulik</NavLink></li>
                <li><NavLink to="/ranking" onClick={() => setIsMobileMenuOpen(false)}>Ranglista</NavLink></li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#bc13fe', fontWeight: 'bold' }}>
                                <i className="fas fa-user"></i> {user?.username}
                            </NavLink>
                        </li>
                        <li>
                            <a onClick={handleLogout} className="btn-neon-outline" style={{ cursor: 'pointer' }}>
                                Kilépés
                            </a>
                        </li>
                    </>
                ) : (
                    <li><NavLink to="/login" className="btn-neon-outline" onClick={() => setIsMobileMenuOpen(false)}>Belépés</NavLink></li>
                )}
            </ul>
            <div className="menu-toggle" onClick={toggleMobileMenu}>
                <i className="fas fa-bars"></i>
            </div>
        </nav>
    );
};

export default Navbar;
