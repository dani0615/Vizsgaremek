import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/AgeGate.css';

const AgeGate = () => {
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            setIsVisible(false);
            return;
        }

        const ageVerified = sessionStorage.getItem('ageVerified');
        if (!ageVerified) {
            setIsVisible(true);
        }
    }, [isAuthenticated]);

    const handleConfirm = () => {
        sessionStorage.setItem('ageVerified', 'true');
        setIsVisible(false);
    };

    const handleReject = () => {
        window.location.href = 'https://www.youtubekids.com';
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="age-gate-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="age-gate-box"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="age-gate-content">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="logo-text">Party <span className="neon-text">Pulse</span></span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                16+ Tartalom
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                Az oldal megtekintése csak nagykorúak számára engedélyezett.
                                <br />Kérjük, igazolja életkorát!
                            </motion.p>

                            <div className="age-gate-actions">
                                <motion.button
                                    className="btn-neon-outline"
                                    onClick={handleReject}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Nem múltam el
                                </motion.button>
                                <motion.button
                                    className="btn-pulse"
                                    onClick={handleConfirm}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Elmúltam 16
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AgeGate;
