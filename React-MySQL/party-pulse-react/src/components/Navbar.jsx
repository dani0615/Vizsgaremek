import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMatchNotifications } from '../context/MatchNotificationContext';
import '../css/Navbar.css';
import '../css/MatchToast.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { unseenCount } = useMatchNotifications();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isUserDropdownOpen) setIsUserDropdownOpen(false);
    };

    const toggleUserDropdown = (e) => {
        e.stopPropagation();
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="logo"><NavLink to="/" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>PARTY<span>PULSE</span></NavLink></div>
            <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links">
                <li><NavLink to="/" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>Kezdőlap</NavLink></li>
                <li><NavLink to="/events" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>Bulik</NavLink></li>
                <li><NavLink to="/ranking" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>Ranglista</NavLink></li>
                {isAuthenticated && (
                    <>
                        <li>
                            <NavLink to="/buddies" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>
                                <span className="nav-match-badge">
                                    Bulitársak
                                    {unseenCount > 0 && (
                                        <span className="nav-match-badge__dot">
                                            {unseenCount > 9 ? '9+' : unseenCount}
                                        </span>
                                    )}
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/messages" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }} className="nav-messages">
                                <i className="fas fa-comment-dots"></i>
                            </NavLink>
                        </li>
                    </>
                )}
                {isAuthenticated ? (
                    <li className={`user-dropdown-container ${isUserDropdownOpen ? 'open' : ''}`}>
                        <div className="user-profile-trigger" onClick={toggleUserDropdown}>
                            <i className="fas fa-user-circle"></i>
                            <span>{user?.username}</span>
                            <i className={`fas ${isUserDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>
                        <ul className={`dropdown-menu ${isUserDropdownOpen ? 'open' : ''}`}>
                            <li>
                                <NavLink to="/profile" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>
                                    <i className="fas fa-id-card"></i> Profilom
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>
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
                    <li><NavLink to="/login" className="btn-login-premium" onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}>Belépés</NavLink></li>
                )}
            </ul>
            <div className="menu-toggle" onClick={toggleMobileMenu}>
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </div>
            {isMobileMenuOpen && <div className="navbar-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>}
        </nav>
    );
};

export default Navbar;
