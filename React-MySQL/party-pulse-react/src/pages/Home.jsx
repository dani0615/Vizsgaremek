import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';

const Home = () => {
    const navigate = useNavigate();
    const { events: allEvents, loading, error, fetchEvents } = useEvents();

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const quickSearch = () => {
        const searchValue = document.getElementById('quick-search-input').value;
        navigate(`/events?keyword=${searchValue}`);
    }

    const featuredEvents = allEvents.slice(0, 3);

    return (
        <main id="home" className="page active">
            <section className="hero">
                <h1><span className="text-gradient">Party Pulse</span></h1>
                <p>Találd meg a legjobb bulikat BAZ megyében!</p>
                <div className="search-box">
                    <input type="text" id="quick-search-input" placeholder="Miskolc, Ózd, Mezőkövesd..." />
                    <button className="btn-pulse" onClick={quickSearch}>Keresés</button>
                </div>
            </section>

            <div className="container">
                <h2 className="section-title">Kiemelt Események <i className="fas fa-fire" style={{ color: '#ff00de' }}></i></h2>
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
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Nincs kiemelt esemény.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Home;