import React from 'react';

const EventCard = ({ event }) => {
    return (
        <div className="event-card">
            <div className="event-img" style={{ backgroundImage: `url('${event.img}')` }}>
                <span className="event-tag">{event.type}</span>
            </div>
            <div className="event-content">
                <h3>{event.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {event.city} - {event.place}</p>
                <p><i className="fas fa-calendar"></i> {event.date}</p>
                <p style={{ fontSize: '0.8rem', margin: '10px 0', opacity: 0.7 }}>{event.desc}</p>
                <button className="btn-neon-outline" style={{ width: '100%' }} onClick={() => alert('Ott leszel! RSVP elmentve.')}>Ott leszek!</button>
            </div>
        </div>
    );
};

export default EventCard;