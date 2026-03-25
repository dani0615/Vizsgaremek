
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const Disclaimer = () => {
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
                        <h1 className="text-gradient">Felelősségvállalás</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', opacity: 0.7}}>Jogi Nyilatkozat</p>
                    </div>

                    <div className="info-content">
                        <h2>1. Információk jellege</h2>
                        <p>
                            A Party Pulse weboldalon közzétett tartalom tájékoztató jellegű. Bár mindent megteszünk az adatok pontosságáért, az események adatait (időpont, ár, program) a szervezők töltik fel, így azokért felelősséget nem tudunk vállalni.
                        </p>
                        
                        <h2>2. Külső hivatkozások</h2>
                        <p>
                            Weboldalunk linkeket tartalmazhat külső webhelyekre (pl. jegyértékesítő oldalak, Facebook események). Ezen oldalak tartalmáért és adatkezelési gyakorlatáért nem vagyunk felelősek.
                        </p>

                        <h2>3. Magatartás az eseményeken</h2>
                        <p>
                            A Party Pulse nem szervezője az oldalon megjelenő eseményeknek. Az eseményeken való részvétel, az ott tanúsított magatartás és az ebből eredő következmények kizárólag a résztvevőt terhelik. Kérjük, szórakozzon felelősségteljesen!
                        </p>

                        <h2>4. Műszaki felelősség</h2>
                        <p>
                            Nem garantáljuk a weboldal 100%-os, hiba- és megszakításmentes működését minden pillanatban, bár törekszünk a legmagasabb szintű rendelkezésre állásra.
                        </p>

                        <h2>5. Alkoholfogyasztás és Korhatár</h2>
                        <p>
                            Az oldalon megjelenő események jelentős része 18+ korhatáros lehet. Felhívjuk figyelmét a felelős alkoholfogyasztásra. A kiskorúak kiszolgálása szeszes itallal minden helyszínen tilos, és ezt a szervezők szigorúan ellenőrizhetik.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Disclaimer;
