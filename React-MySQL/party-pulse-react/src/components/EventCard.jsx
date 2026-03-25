import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiConfig';
import '../css/EventCard.css';

const EventCard = ({ event, onEdit, onDelete, canEdit, canDelete, onCardClick,
    attendeeCount: initialAttendeeCount = 0,
    isAttending: initialIsAttending = false,
    isFavorite: initialIsFavorite = false,
    onReviewClick
}) => {
    const { isAuthenticated } = useAuth();
    const [isAttending, setIsAttending] = useState(initialIsAttending);
    const [attendeeCount, setAttendeeCount] = useState(initialAttendeeCount);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null); // { msg, type }
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [localIsReviewed, setLocalIsReviewed] = useState(event.isReviewed);

    // Sync props → state whenever the parent re-fetches event data
    useEffect(() => {
        setIsAttending(initialIsAttending);
        setAttendeeCount(initialAttendeeCount);
        setIsFavorite(initialIsFavorite);
        setLocalIsReviewed(event.isReviewed);
    }, [initialIsAttending, initialAttendeeCount, initialIsFavorite, event.isReviewed]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAttendance = async () => {
        if (!isAuthenticated) {
            showToast('A részvételhez be kell jelentkezned!', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await apiClient.post(`/Attendance/Toggle/${event.id}`);
            const newStatus = res.data.isAttending ?? res.data.IsAttending;
            setIsAttending(newStatus);
            setAttendeeCount(prev => newStatus ? prev + 1 : Math.max(0, prev - 1));

            if (newStatus) {
                showToast('Jelentkezésed rögzítve! 🎉 Ott leszünk!', 'success');
            } else {
                showToast('Lemondtad a részvételed.', 'info');
            }
        } catch (err) {
            showToast(err.response?.data || 'Hiba történt. Próbáld újra!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            showToast('A kedvencekhez adáshoz be kell jelentkezned!', 'error');
            return;
        }

        try {
            const res = await apiClient.post(`/EventFavorite/Toggle/${event.id}`);
            const { isFavorite: newStatus, message } = res.data;
            setIsFavorite(newStatus);
            showToast(message, 'info');
        } catch (err) {
            showToast(err.response?.data || 'Hiba történt. Próbáld újra!', 'error');
        }
    };

    return (
        <motion.div
            className={`event-card ${event.hasEnded ? 'event-card--ended' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            onClick={onCardClick}
            style={{ cursor: onCardClick ? 'pointer' : 'default' }}
        >
            {/* Toast értesítő */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        className={`event-card-toast event-card-toast--${toast.type}`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="event-img" style={{ backgroundImage: `url('${event.img}')` }}>
                <div className="event-img-overlay"></div>
                <div className="event-type-badge">{event.type}</div>
                
                {isAttending && (
                    <div className="event-going-badge">
                        <i className="fas fa-check-circle"></i> Megyek!
                    </div>
                )}

                {/* Admin controls overlay */}
                {(canEdit || canDelete) && (
                    <div className="event-admin-overlay">
                        {canEdit && (
                            <button
                                className="admin-btn admin-btn--edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                title="Szerkesztés"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                        {canDelete && (
                            <button
                                className="admin-btn admin-btn--delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                title="Törlés"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        )}
                    </div>
                )}

                <button
                    className={`event-favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavorite}
                    title={isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}
                >
                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
                </button>
            </div>

            <div className="event-content">
                <div className="event-header-info">
                    <div className="event-date-mini">
                        <i className="far fa-calendar-alt"></i> {event.displayDate}
                    </div>
                </div>
                
                <h3>{event.name}</h3>
                
                <p className="event-location-text">
                    <i className="fas fa-map-marker-alt"></i> {event.city}, {event.place}
                </p>
                
                <p className="event-description-short">{event.desc}</p>

                <div className="event-card-footer">
                    <div className="event-stats">
                        <span className="event-attendee-count">
                            <i className="fas fa-users"></i> {attendeeCount} fő megy
                        </span>
                    </div>

                    <div className="event-actions">
                        {event.hasEnded ? (
                            <div className="event-ended-group">
                                <span className="event-status-tag">
                                    <i className="fas fa-flag-checkered"></i> Befejeződött
                                </span>
                                {isAttending && !localIsReviewed && onReviewClick && (
                                    <motion.button
                                        className="btn-review"
                                        onClick={(e) => { e.stopPropagation(); onReviewClick(event); }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <i className="fas fa-star"></i> Értékelem!
                                    </motion.button>
                                )}
                                {isAttending && localIsReviewed && (
                                    <span className="event-reviewed-tag">
                                        <i className="fas fa-star"></i> Értékelted
                                    </span>
                                )}
                            </div>
                        ) : (
                            <motion.button
                                className={`btn-primary-action ${isAttending ? 'btn-primary-action--active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAttendance();
                                }}
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.05 }}
                                whileTap={{ scale: loading ? 1 : 0.95 }}
                            >
                                {loading ? (
                                    <i className="fas fa-circle-notch fa-spin"></i>
                                ) : isAttending ? (
                                    <>
                                        <i className="fas fa-check"></i>
                                        <span>Ott leszek!</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-calendar-plus"></i>
                                        <span>Ott leszek!</span>
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;