import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../services/apiConfig';

const ReviewModal = ({ isOpen, onClose, event, onReviewSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ha nincs nyitva, ne is rendereljen semi pluszt.
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Kérlek mondd el, hány csillagot adnál a bulinak!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiClient.post('/Review/Create', {
                eventId: event.id,
                rating,
                comment
            });
            onReviewSuccess();
            onClose();
            // Reset state
            setRating(0);
            setHoverRating(0);
            setComment('');
        } catch (err) {
            setError(err.response?.data || 'Valami hiba történt az értékelés elküldésekor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="events-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 99999, backdropFilter: 'blur(10px)'
                }}
            >
                <motion.div
                    className="modal-content glass-modal"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    style={{
                        padding: '2.5rem', borderRadius: '28px', maxWidth: '450px', width: '95%',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    <div className="glass-shine" style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                    
                    <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#fff', fontSize: '2rem', fontWeight: '800' }}>
                        Értékeld a bulit!
                    </h2>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '1rem' }}>
                        {event?.name}
                    </p>

                    {error && (
                        <div style={{ background: 'rgba(255,60,80,0.15)', color: '#ff3c50', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(255,60,80,0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        
                        {/* Csillagok */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '3rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    type="button"
                                    key={star}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: (hoverRating || rating) >= star ? '#ffd700' : 'rgba(255,255,255,0.1)',
                                        textShadow: (hoverRating || rating) >= star ? '0 0 20px rgba(255,215,0,0.5)' : 'none',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    ★
                                </motion.button>
                            ))}
                        </div>

                        {/* Szöveges értékelés */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Véleményed (opcionális)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Milyen volt a hangulat? Mit imádtál a legjobban?"
                                rows="4"
                                style={{
                                    width: '100%', padding: '15px', borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff', fontSize: '1rem', resize: 'vertical', outline: 'none',
                                    transition: 'border-color 0.3s, box-shadow 0.3s'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 15px rgba(188,19,254,0.2)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Gombok */}
                        <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '50px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.7)', cursor: 'pointer', opacity: loading ? 0.5 : 1, fontWeight: '700', transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}
                            >
                                Mégse
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1.5, padding: '14px', borderRadius: '50px',
                                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                    border: 'none', color: '#fff', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 25px rgba(188,19,254,0.4)',
                                    opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                                }}
                            >
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-paper-plane"></i> Küldés</>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReviewModal;
