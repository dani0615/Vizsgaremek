
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const Contact = () => {
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
                        <h1 className="text-gradient">Kapcsolat</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', opacity: 0.8}}>Kérdésed van? Vedd fel velünk a kapcsolatot!</p>
                    </div>

                    <div className="info-content">
                        <p style={{textAlign: 'center', marginBottom: '40px'}}>
                            Legyen szó hibajelentésről, üzleti megkeresésről vagy csak egy jó ötletről, várjuk leveledet. Csapatunk igyekszik 24 órán belül válaszolni minden megkeresésre.
                        </p>

                        <div className="contact-grid">
                            <div className="contact-card">
                                <i className="fas fa-envelope"></i>
                                <h3>Email</h3>
                                <p>hello@partypulsebaz.hu</p>
                                <p>support@partypulsebaz.hu</p>
                            </div>
                            <div className="contact-card">
                                <i className="fas fa-phone"></i>
                                <h3>Telefon</h3>
                                <p>+36 46 123 4567</p>
                                <p>H-P: 09:00 - 17:00</p>
                            </div>
                            <div className="contact-card">
                                <i className="fas fa-map-marker-alt"></i>
                                <h3>Iroda</h3>
                                <p>3525 Miskolc,</p>
                                <p>Városház tér 1.</p>
                            </div>
                        </div>

                        <div style={{marginTop: '60px', textAlign: 'center'}}>
                            <h2><i className="fas fa-share-alt"></i> Kövess minket</h2>
                            <p>Legyél naprakész a közösségi médiában is!</p>
                            <div style={{display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '2rem', marginTop: '20px'}}>
                                <a href="#" style={{color: 'var(--primary)'}}><i className="fab fa-instagram"></i></a>
                                <a href="#" style={{color: 'var(--primary)'}}><i className="fab fa-facebook"></i></a>
                                <a href="#" style={{color: 'var(--primary)'}}><i className="fab fa-tiktok"></i></a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
