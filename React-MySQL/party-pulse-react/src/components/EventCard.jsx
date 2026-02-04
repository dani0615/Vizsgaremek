import React from 'react';

const EventCard = ({ event }) => {
    return (
        <div className="event-card">
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
                <p className="event-description-short">{event.desc}</p>
                <div className="event-card-actions">
                    <button className="btn-neon-outline" onClick={() => alert(`${event.name}: Szuper! Hozzáadtuk a naptáradhoz.`)}>
                        Ott leszek!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;