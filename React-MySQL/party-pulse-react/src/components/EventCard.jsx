import React from 'react';
import { motion } from 'framer-motion';
import '../css/EventCard.css';

const EventCard = ({ event }) => {
    return (
        <motion.div
            className="event-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
            <div className="event-img" style={{ backgroundImage: `url('${event.img}')` }}>
                <div className="event-type-badge">{event.type}</div>
            </div>
            <div className="event-content">
                <div className="event-date-mini">
                    <i className="far fa-calendar-alt"></i> {event.displayDate}
                </div>
                <h3>{event.name}</h3>
                <p className="event-location-text">
                    <i className="fas fa-map-marker-alt"></i> {event.city}, {event.place}
                </p>
                <p className="event-description-short">
                    {event.desc}
                </p>
                <div className="event-card-actions">
                    <motion.button
                        className="btn-neon-outline"
                        onClick={() => alert(`${event.name}: Szuper! Hozzáadtuk a naptáradhoz.`)}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(188, 19, 254, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Ott leszek!
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;