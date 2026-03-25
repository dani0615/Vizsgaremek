
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const SubmitEvent = () => {
    return (
        <div className="info-page page">
            <div className="container">
                <motion.div 
                    className="info-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="info-header">
                        <h1 className="text-gradient">Esemény beküldése</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', opacity: 0.8}}>Szervező vagy? Juttasd el a bulidat több ezer fiatalhoz!</p>
                    </div>

                    <div className="info-content">
                        <h2><i className="fas fa-plus-circle"></i> Hogyan működik?</h2>
                        <p>
                            A Party Pulse célja, hogy minden minőségi esemény helyet kapjon a platformon. A beküldési folyamat egyszerű és ingyenes az alapcsomagban.
                        </p>
                        
                        <ul>
                            <li><strong>Regisztráció:</strong> Hozz létre egy szervezői fiókot.</li>
                            <li><strong>Adatok megadása:</strong> Töltsd fel az esemény nevét, időpontját, helyszínét és egy figyelemfelkeltő borítóképet.</li>
                            <li><strong>Ellenőrzés:</strong> Csapatunk 12 órán belül jóváhagyja az eseményt.</li>
                            <li><strong>Megjelenés:</strong> Az esemény bekerül az idővonalra és a térképre is.</li>
                        </ul>

                        <h2><i className="fas fa-rocket"></i> Kiemelési lehetőségek</h2>
                        <p>
                            Szeretnéd, ha a te bulid lenne az első a listában? Válassz kiemelési csomagjaink közül:
                        </p>
                        <div className="contact-grid">
                            <div className="contact-card">
                                <h3>Bronz</h3>
                                <p>Ingyenes</p>
                                <p style={{fontSize: '0.8rem', marginTop: '10px'}}>Alap megjelenés a listában</p>
                            </div>
                            <div className="contact-card" style={{borderColor: 'var(--yellow)'}}>
                                <h3 style={{color: 'var(--yellow)'}}>Gold</h3>
                                <p>Fix hely az élmezőnyben</p>
                                <p style={{fontSize: '0.8rem', marginTop: '10px'}}>Push értesítés a követőknek</p>
                            </div>
                        </div>

                        <div style={{marginTop: '40px', textAlign: 'center'}}>
                            <button className="btn-pulse" style={{fontSize: '1.2rem', padding: '15px 40px'}}>
                                Szervezői regisztráció indítása
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SubmitEvent;
