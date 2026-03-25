import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import ReviewModal from '../components/ReviewModal';
import { useEvents } from '../hooks/useEvents';
import PartyBackground from '../components/3d/PartyParticles';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { events: allEvents, loading, error, fetchEvents } = useEvents();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [eventToReview, setEventToReview] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const quickSearch = () => {
        const searchValue = document.getElementById('quick-search-input').value;
        navigate(`/events?keyword=${searchValue}`);
    };

    const handleReviewClick = (event) => {
        setEventToReview(event);
        setShowReviewModal(true);
    };

    const handleReviewSuccess = () => {
        fetchEvents();
    };

    const featuredEvents = allEvents.slice(0, 3);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div id="home" className="home-page">
            <section className="hero">
                <PartyBackground
                    containerStyle={{ zIndex: 0 }}
                    count={3000}
                    color="#ff00de"
                />

                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={itemVariants}>
                        <span className="text-gradient">Party Pulse</span>
                    </motion.h1>
                    <motion.p variants={itemVariants}>
                        Találd meg a legjobb bulikat BAZ megyében!
                    </motion.p>
                    <motion.div
                        className="search-box"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <input type="text" id="quick-search-input" placeholder="Miskolc, Ózd, Mezőkövesd..." />
                        <button className="btn-pulse" onClick={quickSearch}>Keresés</button>
                    </motion.div>
                </motion.div>
            </section>

            <div className="container">
                <h2 className="section-title">
                    Kiemelt Események <i className="fas fa-fire" style={{ color: '#ff00de' }}></i>
                </h2>
                <div className="event-grid" id="featured-events">
                    {loading ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                            <i className="fas fa-spinner fa-spin"></i> Események betöltése...
                        </p>
                    ) : error ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#ff4444' }}>
                            Nem sikerült betölteni az eseményeket.
                        </p>
                    ) : featuredEvents.length > 0 ? (
                        featuredEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                attendeeCount={event.attendeeCount ?? 0}
                                isAttending={event.isAttending ?? false}
                                isFavorite={event.isFavorite ?? false}
                                onReviewClick={handleReviewClick}
                            />
                        ))
                    ) : (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Nincs kiemelt esemény.</p>
                    )}
                </div>
            </div>

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                event={eventToReview}
                onReviewSuccess={handleReviewSuccess}
            />
        </div>
    );
};

export default Home;