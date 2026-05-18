
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const Privacy = () => {
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
                        <h1 className="text-gradient">Adatvédelem</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', opacity: 0.7}}>Adatvédelmi Nyilatkozat és Tájékoztató</p>
                    </div>

                    <div className="info-content">
                        <h2>1. Adatkezelő adatai</h2>
                        <p>
                            A Party Pulse csapata elkötelezett a felhasználói adatok védelme mellett. Minden adatkezelés a hatályos GDPR szabályozásoknak megfelelően történik.
                        </p>
                        
                        <h2>2. Gyűjtött adatok köre</h2>
                        <ul>
                            <li><strong>Profil adatok:</strong> Név, e-mail cím, felhasználónév (regisztráció esetén).</li>
                            <li><strong>Technikai adatok:</strong> IP cím, böngésző típusa, sütik (cookies).</li>
                            <li><strong>Használati adatok:</strong> Megtekintett események, kedvencek, ranglista helyezés.</li>
                        </ul>

                        <h2>3. Az adatkezelés célja</h2>
                        <p>
                            Az adatokat kizárólag a szolgáltatás nyújtása, a felhasználói élmény javítása, a ranglista működtetése és (feliratkozás esetén) hírlevelek küldése céljából kezeljük.
                        </p>

                        <h2>4. Adatok továbbítása</h2>
                        <p>
                            Harmadik fél számára adatokat nem adunk el. Kivételt képeznek a hatósági megkeresések, illetve az anonim statisztikai adatok a hirdetők felé (pl. hányan néztek meg egy eseményt).
                        </p>

                        <h2>5. Az Ön jogai</h2>
                        <p>
                            Ön bármikor kérheti adatainak törlését, módosítását vagy kikérheti az összes Önnel kapcsolatban tárolt adatot ügyfélszolgálatunktól.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Privacy;
