import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Map from '../components/Map';
import { useEvents } from '../hooks/useEvents';
import '../css/Events.css';

const Events = () => {
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [city, setCity] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [type, setType] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.7784, 48.1035]); // Default: Miskolc

    const { events: allEvents, loading, error, fetchEvents } = useEvents();

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Hónapok kigyűjtése és eseményszámok számolása
    const months = React.useMemo(() => {
        const counts = {};
        allEvents.forEach(e => {
            if (e.date) {
                const month = e.date.substring(0, 7); // YYYY-MM
                counts[month] = (counts[month] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, count]) => ({
                value: month,
                label: new Date(month + '-01').toLocaleString('hu-HU', { year: 'numeric', month: 'long' }),
                count
            }));
    }, [allEvents]);

    // Térkép középpont frissítése és szűrés
    useEffect(() => {
        const filtered = allEvents.filter(event => {
            const matchesKeyword = (event.name?.toLowerCase().includes(keyword.toLowerCase()) ||
                event.desc?.toLowerCase().includes(keyword.toLowerCase()));
            const matchesCity = (city === '' || event.city === city);
            const matchesMonth = (selectedMonth === '' || (event.date && event.date.startsWith(selectedMonth)));
            const matchesType = (type === '' || event.type === type);
            return matchesKeyword && matchesCity && matchesMonth && matchesType;
        });
        setFilteredEvents(filtered);

        // Ha van szűrt eredmény és város, fókuszáljunk az elsőre
        if (filtered.length > 0 && filtered[0].lat && filtered[0].lon) {
            setMapCenter([filtered[0].lon, filtered[0].lat]);
        }
    }, [keyword, city, selectedMonth, type, allEvents]);

    const markers = filteredEvents
        .filter(e => e.lat && e.lon)
        .map(e => ({
            lat: e.lat,
            lon: e.lon,
            name: `${e.name} @ ${e.place}`
        }));

    return (
        <section id="events" className="page">
            <div className="container">
                <h2 className="section-title">Party Térkép & Kereső</h2>

                <div className="filters-premium">
                    <div className="filter-group">
                        <label>Keresés</label>
                        <input
                            type="text"
                            placeholder="Kulcsszó (pl. Techno, DJ)..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label>Város</label>
                        <select value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="">Összes Város</option>
                            <option value="Miskolc">Miskolc</option>
                            <option value="Mezőkövesd">Mezőkövesd</option>
                            <option value="Ózd">Ózd</option>
                            <option value="Sárospatak">Sárospatak</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Időszak</label>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option value="">Bármikor</option>
                            {months.map(m => (
                                <option key={m.value} value={m.value}>
                                    {m.label} ({m.count} buli)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Stílus</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Összes Stílus</option>
                            <option value="techno">Techno</option>
                            <option value="house">House</option>
                            <option value="pop">Pop</option>
                            <option value="rock">Rock</option>
                            <option value="hiphop">Hip-Hop</option>
                        </select>
                    </div>
                </div>

                <div className="map-wrapper-premium">
                    <Map
                        center={mapCenter}
                        zoom={city ? 13 : 10}
                        markers={markers}
                    />
                    <div className="map-overlay-info">
                        <i className="fas fa-info-circle"></i> Kattints a jelölőkre a részletekért
                    </div>
                </div>

                <div className="event-grid-header">
                    <h3>Találatok ({filteredEvents.length})</h3>
                </div>

                <div className="event-grid">
                    {loading ? (
                        <div className="loading-container">
                            <i className="fas fa-circle-notch fa-spin"></i>
                            <p>Események betöltése...</p>
                        </div>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <p>Nincs találat a megadott feltételekkel.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Events;
