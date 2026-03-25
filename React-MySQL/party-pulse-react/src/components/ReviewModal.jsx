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
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 99999, backdropFilter: 'blur(8px)'
                }}
            >
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    style={{
                        background: 'linear-gradient(145deg, rgba(30,10,50,0.95), rgba(10,25,40,0.95))',
                        padding: '2rem', borderRadius: '24px', maxWidth: '400px', width: '90%',
                        border: '1px solid rgba(188,19,254,0.3)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(188,19,254,0.1)'
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#fff', fontSize: '1.8rem' }}>
                        Értékeld a bulit!
                    </h2>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        {event?.name}
                    </p>

                    {error && (
                        <div style={{ background: 'rgba(255,60,80,0.15)', color: '#ff3c50', padding: '10px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Csillagok */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '2.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    type="button"
                                    key={star}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: (hoverRating || rating) >= star ? '#ffd700' : 'rgba(255,255,255,0.15)',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    ★
                                </motion.button>
                            ))}
                        </div>

                        {/* Szöveges értékelés */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>
                                Véleményed (opcionális)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Milyen volt a hangulat? Mit imádtál a legjobban?"
                                rows="4"
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff', fontSize: '0.95rem', resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Gombok */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '50px',
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff', cursor: 'pointer', opacity: loading ? 0.5 : 1
                                }}
                            >
                                Mégse
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '50px',
                                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                    border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer',
                                    opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}
                            >
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Küldés'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReviewModal;
