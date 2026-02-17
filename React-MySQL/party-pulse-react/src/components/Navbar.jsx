import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Navbar.css';

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
                    <li className="user-dropdown-container">
                        <div className="user-profile-trigger">
                            <i className="fas fa-user-circle"></i>
                            <span>{user?.username}</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <ul className="dropdown-menu">
                            <li>
                                <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                    <i className="fas fa-id-card"></i> Profilom
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                    <i className="fas fa-user-edit"></i> Profil szerkesztése
                                </NavLink>
                            </li>
                            <li className="dropdown-divider"></li>
                            <li>
                                <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                    <i className="fas fa-sign-out-alt"></i> Kijelentkezés
                                </a>
                            </li>
                        </ul>
                    </li>
                ) : (
                    <li><NavLink to="/login" className="btn-login-premium" onClick={() => setIsMobileMenuOpen(false)}>Belépés</NavLink></li>
                )}
            </ul>
            <div className="menu-toggle" onClick={toggleMobileMenu}>
                <i className="fas fa-bars"></i>
            </div>
        </nav>
    );
};

export default Navbar;
