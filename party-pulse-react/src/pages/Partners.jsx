
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const Partners = () => {
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
                        <h1 className="text-gradient">Partnerprogram</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', opacity: 0.8}}>Növekedjünk együtt! Csatlakozz a Party Pulse hálózatához.</p>
                    </div>

                    <div className="info-content">
                        <h2><i className="fas fa-handshake"></i> Kiknek szól?</h2>
                        <p>
                            Partnerprogramunkat olyan helyszíneknek, promótereknek és beszállítóknak alakítottuk ki, akik hosszútávon szeretnének jelen lenni a megye bulitérképén.
                        </p>
                        
                        <div className="contact-grid">
                            <div className="contact-card">
                                <h3>Szórakozóhelyek</h3>
                                <p>Saját aloldal, dedikált eseménykezelő felület és statisztikák.</p>
                            </div>
                            <div className="contact-card">
                                <h3>DJ-k & Fellépők</h3>
                                <p>Megjelenés a ranglistán, portfólió kezelés és foglalási lehetőség.</p>
                            </div>
                            <div className="contact-card">
                                <h3>Taxisok & Szolgáltatók</h3>
                                <p>Közvetlen elérés a szórakozni vágyó közönséghez a megfelelő pillanatban.</p>
                            </div>
                        </div>

                        <h2 style={{marginTop: '50px'}}><i className="fas fa-chart-line"></i> Miért éri meg?</h2>
                        <ul>
                            <li><strong>Célzott elérés:</strong> Pontosan azt a korosztályt érheti el, akik az Ön szolgáltatását keresik.</li>
                            <li><strong>Adatvezérelt döntések:</strong> Havi riportokat küldünk az események látogatottságáról és a felhasználói érdeklődésről.</li>
                            <li><strong>Közös kampányok:</strong> Lehetőség nyereményjátékok és exkluzív kuponok futtatására a platformon.</li>
                        </ul>

                        <div style={{marginTop: '40px', textAlign: 'center', background: 'rgba(188, 19, 254, 0.1)', padding: '30px', borderRadius: '15px'}}>
                            <h3>Szeretne partner lenni?</h3>
                            <p style={{marginBottom: '20px'}}>Írjon nekünk a <strong>partners@partypulsebaz.hu</strong> címre, és munkatársunk felveszi Önnel a kapcsolatot.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Partners;
