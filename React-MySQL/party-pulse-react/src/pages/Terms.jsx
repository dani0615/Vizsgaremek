
import React from 'react';
import '../css/InfoPages.css';
import { motion } from 'framer-motion';

const Terms = () => {
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
                        <h1 className="text-gradient">ÁSZF</h1>
                        <div className="accent-line"></div>
                        <p style={{marginTop: '20px', opacity: 0.7}}>Általános Szerződési Feltételek - Érvényes: 2024.01.01-től</p>
                    </div>

                    <div className="info-content">
                        <h2>1. Általános Rendelkezések</h2>
                        <p>
                            Jelen dokumentum a Party Pulse (továbbiakban: Szolgáltató) és a szolgáltatást igénybe vevő (továbbiakban: Felhasználó) közötti jogviszonyt szabályozza. A platform használatával a Felhasználó elfogadja a jelen feltételeket.
                        </p>
                        
                        <h2>2. Szolgáltatás Tartalma</h2>
                        <p>
                            A Party Pulse egy eseménygyűjtő és közösségi platform, amely tájékoztatást nyújt a Borsod-Abaúj-Zemplén megyei szórakoztatóipari eseményekről. A platform nem szervezője az eseményeknek, csupán információs csatorna.
                        </p>

                        <h2>3. Regisztráció és Biztonság</h2>
                        <ul>
                            <li>A regisztrációhoz valós adatok megadása szükséges.</li>
                            <li>A felhasználó felelős a jelszava biztonságban tartásáért.</li>
                            <li>A platform használata 18. életévüket betöltött személyek számára ajánlott (alkoholos tartalmú események esetén kötelező).</li>
                        </ul>

                        <h2>4. Felelősség Korlátozása</h2>
                        <p>
                            Szolgáltató nem vállal felelősséget az események elmaradásáért, a megadott adatok esetleges pontatlanságáért (amelyeket a szervezők adtak meg), illetve az eseményeken történt esetleges incidensekért.
                        </p>

                        <h2>5. Szerzői Jogok</h2>
                        <p>
                            A weboldalon található minden egyedi grafikai elem, kód és tartalom a Party Pulse tulajdonát képezi, azok felhasználása csak előzetes írásbeli engedéllyel lehetséges.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;
