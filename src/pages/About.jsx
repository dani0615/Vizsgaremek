
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const About = () => {
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
                        <h1 className="text-gradient">Rólunk</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', fontSize: '1.2rem', opacity: 0.8}}>
                            A Party Pulse nem csak egy weboldal – ez a Borsod-Abaúj-Zemplén megyei éjszakai élet lüktető szíve.
                        </p>
                    </div>

                    <div className="info-content">
                        <h2><i className="fas fa-bullseye"></i> Küldetésünk</h2>
                        <p>
                            Célunk, hogy közelebb hozzuk a megye party arcait a legjobb eseményekhez. Legyen szó a miskolci belváros lüktetéséről, vagy a környező városok legvadabb bulijairól, mi ott vagyunk, hogy te is ott lehess.
                        </p>
                        
                        <h2><i className="fas fa-star"></i> Miért a Party Pulse?</h2>
                        <ul>
                            <li><strong>Minden egy helyen:</strong> Nem kell többé tucatnyi Facebook oldalt böngészned. Itt minden fontos bulit megtalálsz.</li>
                            <li><strong>Közösség:</strong> Építs hírnevet, gyűjts pontokat a részvételeddel, és kerülj fel a megyei ranglistára.</li>
                            <li><strong>Exkluzív kedvezmények:</strong> Aktív felhasználóinknak különleges ajánlatokkal és belépőkkel kedveskedünk.</li>
                        </ul>

                        <h2><i className="fas fa-history"></i> Történetünk</h2>
                        <p>
                            A projekt 2024-ben indult el pár miskolci fiatal víziójaként, akik unták, hogy lemaradnak a legjobb eseményekről az információ-áradat miatt. Létrehoztunk egy platformot, ami tiszta, átlátható és kifejezetten a mi régiónkra fókuszál.
                        </p>

                        <div className="contact-grid">
                            <div className="contact-card">
                                <i className="fas fa-users"></i>
                                <h3>5000+</h3>
                                <p>Aktív Felhasználó</p>
                            </div>
                            <div className="contact-card">
                                <i className="fas fa-glass-cheers"></i>
                                <h3>200+</h3>
                                <p>Heti Esemény</p>
                            </div>
                            <div className="contact-card">
                                <i className="fas fa-map-marker-alt"></i>
                                <h3>BAZ-Megye</h3>
                                <p>Elsőszámú Gyűjtőhelye</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
