import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="footer-grid">
                <div className="footer-section">
                    <h3>Party <span className="neon-text">Pulse</span></h3>
                    <p>A Borsod-Abaúj-Zemplén megyei party arcok első számú találkozóhelye. Keress eseményeket, gyűjts pontokat és légy te a megye királya!</p>
                    <div className="social-icons-wrapper">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="fab fa-tiktok"></i>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Gyors Linkek</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Kezdőlap</Link></li>
                        <li><Link to="/events">Események</Link></li>
                        <li><Link to="/ranking">Ranglista</Link></li>
                        <li><Link to="/profile">Profilom</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Információ</h4>
                    <ul className="footer-links">
                        <li><Link to="/about">Rólunk</Link></li>
                        <li><Link to="/submit-event">Esemény beküldése</Link></li>
                        <li><Link to="/contact">Kapcsolat</Link></li>
                        <li><Link to="/partners">Partnerprogram</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Jogi tudnivalók</h4>
                    <ul className="footer-links">
                        <li><Link to="/terms">ÁSZF</Link></li>
                        <li><Link to="/privacy">Adatvédelmi nyilatkozat</Link></li>
                        <li><Link to="/cookies">Cookie tájékoztató</Link></li>
                        <li><Link to="/disclaimer">Felelősségvállalás</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Party Pulse BAZ. Made with <i className="fas fa-heart" style={{ color: 'var(--primary)' }}></i> in <span>Miskolc</span>
            </div>
        </footer>
    );
};

export default Footer;