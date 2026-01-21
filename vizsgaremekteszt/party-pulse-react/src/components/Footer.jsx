import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="footer-grid">
                <div className="footer-section">
                    <h3>Party Pulse</h3>
                    <p>A #1 eseménykereső Borsod-Abaúj-Zemplén megyében.</p>
                </div>
                <div className="footer-section">
                    <h4>Linkek</h4>
                    <ul>
                        <li><a href="#">Rólunk</a></li>
                        <li><a href="#">Kapcsolat</a></li>
                        <li><a href="#">Adatvédelem</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Social</h4>
                    <div className="social-icons">
                        <i className="fab fa-instagram"></i>
                        <i className="fab fa-facebook"></i>
                        <i className="fab fa-tiktok"></i>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">&copy; 2026 Party Pulse BAZ. Minden jog fenntartva.</div>
        </footer>
    );
};

export default Footer;