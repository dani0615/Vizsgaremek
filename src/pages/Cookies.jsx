
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const Cookies = () => {
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
                        <h1 className="text-gradient">Sütik</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', opacity: 0.7}}>Cookie (Süti) Tájékoztató</p>
                    </div>

                    <div className="info-content">
                        <h2>Mik azok a sütik?</h2>
                        <p>
                            A sütik kisméretű szöveges fájlok, amelyeket a webhely tárol az Ön számítógépén vagy mobilján, amikor meglátogatja az oldalt. Ez lehetővé teszi a webhely számára, hogy egy ideig emlékezzen az Ön műveleteire és preferenciáira.
                        </p>
                        
                        <h2>Hogyan használjuk a sütiket?</h2>
                        <ul>
                            <li><strong>Alapvető sütik:</strong> Szükségesek az oldal bejelentkezési funkcióihoz és biztonságához.</li>
                            <li><strong>Analitikai sütik:</strong> Segítenek megérteni, mely események a legnépszerűbbek, hogy még jobb tartalmat kínálhassunk.</li>
                            <li><strong>Marketing sütik:</strong> Személyre szabott hirdetések megjelenítéséhez használjuk őket.</li>
                        </ul>

                        <h2>A sütik kezelése</h2>
                        <p>
                            A legtöbb böngésző lehetővé teszi a sütik szabályozását a beállításokon keresztül. Felhívjuk figyelmét, hogy a sütik letiltása esetén a Party Pulse bizonyos funkciói (pl. bejelentkezve maradás) nem fognak megfelelően működni.
                        </p>

                        <h2>Harmadik féltől származó sütik</h2>
                        <p>
                            Oldalunkon használunk Google Analytics és Facebook Pixel sütiket, amelyek az adott cégek adatvédelmi szabályzata alá tartoznak.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Cookies;
