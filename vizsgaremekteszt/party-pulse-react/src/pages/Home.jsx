import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { events } from '../data/events';

const Home = () => {
    const navigate = useNavigate();

    const quickSearch = () => {
        const searchValue = document.getElementById('quick-search-input').value;
        navigate(`/events?keyword=${searchValue}`);
    }

    const featuredEvents = events.slice(0, 3);

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
                    {featuredEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Home;