import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import Map from '../components/Map';
import CreateEventModal from '../components/CreateEventModal';
import ReviewModal from '../components/ReviewModal';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiConfig';
import GlassSelect from '../components/GlassSelect';
import '../css/Events.css';

const CITY_OPTIONS = [
    { value: '', label: 'Összes Város' },
    { value: 'Miskolc', label: 'Miskolc' },
    { value: 'Mezőkövesd', label: 'Mezőkövesd' },
    { value: 'Ózd', label: 'Ózd' },
    { value: 'Sárospatak', label: 'Sárospatak' },
];

const STYLE_OPTIONS = [
    { value: '', label: 'Összes Stílus' },
    { value: 'techno', label: 'Techno' },
    { value: 'house', label: 'House' },
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'hiphop', label: 'Hip-Hop' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'metal', label: 'Metal' },
    { value: 'latin', label: 'Latin' },
    { value: 'drumandbass', label: 'Drum and Bass' },
    { value: 'other', label: 'Egyéb' },
];

// Jogosult szerepkörök az esemény létrehozáshoz
const CAN_CREATE_ROLES = ['admin', 'organizer'];

const CITY_COORDINATES = {
    'Miskolc': [20.7784, 48.1035],
    'Mezőkövesd': [20.5724, 47.8105],
    'Ózd': [20.2858, 48.2185],
    'Sárospatak': [21.5658, 48.3184],
    'default': [20.7784, 48.1035]
};

const Events = () => {
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [city, setCity] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [type, setType] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.7784, 48.1035]); // Default: Miskolc
    const [mapZoom, setMapZoom] = useState(10);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [listTab, setListTab] = useState('upcoming');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [eventToReview, setEventToReview] = useState(null);

    const { events: allEvents, loading, error, fetchEvents } = useEvents();
    const { user, isAuthenticated } = useAuth();

    // Ellenőrizzük, hogy a felhasználónak van-e joga bulit létrehozni
    const canCreate = isAuthenticated && user?.role && CAN_CREATE_ROLES.includes(user.role.toLowerCase());

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
                label: `${new Date(month + '-01').toLocaleString('hu-HU', { year: 'numeric', month: 'long' })} (${count} buli)`,
                count
            }));
    }, [allEvents]);

    // Térkép középpont frissítése és szűrés
    useEffect(() => {
        const filtered = allEvents.filter(event => {
            const searchStr = keyword.toLowerCase();
            const matchesKeyword = (
                event.name?.toLowerCase().includes(searchStr) ||
                event.desc?.toLowerCase().includes(searchStr) ||
                event.city?.toLowerCase().includes(searchStr) ||
                event.place?.toLowerCase().includes(searchStr)
            );
            const matchesCity = (city === '' || event.city === city);
            const matchesMonth = (selectedMonth === '' || (event.date && event.date.startsWith(selectedMonth)));
            const matchesType = (type === '' || event.type === type);
            const matchesTab = listTab === 'past' ? event.hasEnded : !event.hasEnded;
            return matchesKeyword && matchesCity && matchesMonth && matchesType && matchesTab;
        });
        setFilteredEvents(filtered);

        // Térkép szinkronizáció
        if (city && CITY_COORDINATES[city]) {
            // Ha várost választottunk, fókuszáljunk a városra
            setMapCenter(CITY_COORDINATES[city]);
            setMapZoom(13);
        } else if (filtered.length > 0 && filtered[0].lat !== null && filtered[0].lon !== null) {
            // Ha van találat (de nincs konkrét város szűrő), fókuszáljunk az első találatra
            setMapCenter([filtered[0].lon, filtered[0].lat]);
            setMapZoom(11);
        } else if (!city && !keyword) {
            // Reset alaphelyzetbe
            setMapCenter(CITY_COORDINATES['default']);
            setMapZoom(10);
        }
    }, [keyword, city, selectedMonth, type, allEvents, listTab]);

    const markers = filteredEvents
        .filter(e => e.lat !== null && e.lon !== null)
        .map(e => ({
            lat: e.lat,
            lon: e.lon,
            name: `${e.name} @ ${e.place}`
        }));

    // Sikeres létrehozás/szerkesztés után frissítjük a listát
    const handleEventCreated = () => {
        fetchEvents();
    };

    const handleReviewClick = (event) => {
        setEventToReview(event);
        setShowReviewModal(true);
    };

    const handleReviewSuccess = () => {
        fetchEvents(); // Refresh to update review status
    };

    const handleEditClick = (event) => {
        setEventToEdit(event);
        setShowCreateModal(true);
    };

    const handleDeleteClick = async (eventId) => {
        if (!window.confirm("Biztosan törölni szeretnéd ezt az eseményt? A művelet nem vonható vissza.")) return;

        try {
            await apiClient.delete(`/Event/Delete/${eventId}`);
            fetchEvents();
        } catch (err) {
            console.error("Hiba a törlés során:", err);
            const msg = err.response?.data || err.message || 'Ismeretlen hiba történt.';
            alert(typeof msg === 'string' ? `Hiba a törlés során: ${msg}` : "Váratlan hiba történt a törlés során.");
        }
    };

    const handleCardClick = (event) => {
        if (event.lat !== null && event.lon !== null) {
            setMapCenter([event.lon, event.lat]);
            setMapZoom(17); // Jobban belenagyít
            // Görgetés a térképhez, hogy a felhasználó lássa a fókuszba helyezett helyszínt
            const mapElement = document.querySelector('.map-wrapper-premium');
            if (mapElement) {
                const elementPosition = mapElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - 100; // Kis eltolás, hogy szépen látszódjon
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            alert('Ennek az eseménynek nincsenek megadva koordinátái.');
        }
    };

    return (
        <section id="events" className="page">
            <div className="container">

                {/* ── Oldal fejléc + Új buli gomb ──────────────────── */}
                <div className="events-page-header">
                    <h2 className="section-title">Party Térkép &amp; Kereső</h2>

                    {canCreate && (
                        <motion.button
                            id="btn-create-event"
                            className="btn-create-event"
                            onClick={() => setShowCreateModal(true)}
                            whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(188,19,254,0.55)' }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <i className="fas fa-plus-circle"></i>
                            <span>Új buli</span>
                        </motion.button>
                    )}
                </div>

                {/* Admin / organizer badge */}
                {canCreate && (
                    <motion.div
                        className="events-role-badge"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <i className="fas fa-shield-alt"></i>
                        <span>
                            {user?.role === 'admin' ? 'Admin' : 'Organizer'} módban vagy – új bulikat hozhatsz létre
                        </span>
                    </motion.div>
                )}

                {/* ── Szűrők ───────────────────────────────────────── */}
                <div className="filters-premium">
                    <div className="filter-group">
                        <label>Keresés</label>
                        <input
                            type="text"
                            placeholder="Kulcsszó, város vagy helyszín..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <GlassSelect 
                        label="Város"
                        value={city}
                        options={CITY_OPTIONS}
                        onChange={(e) => setCity(e.target.value)}
                    />

                    <GlassSelect 
                        label="Időszak"
                        value={selectedMonth}
                        options={[{ value: '', label: 'Bármikor' }, ...months]}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />

                    <GlassSelect 
                        label="Stílus"
                        value={type}
                        options={STYLE_OPTIONS}
                        onChange={(e) => setType(e.target.value)}
                    />
                </div>

                {/* ── Tabok ───────────────────────────────────────── */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => setListTab('upcoming')}
                        style={{ padding: '10px 24px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', background: listTab === 'upcoming' ? 'linear-gradient(90deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: listTab === 'upcoming' ? '0 4px 15px rgba(188,19,254,0.4)' : 'none' }}
                    >
                        📍 Közelgő bulik
                    </button>
                    <button 
                        onClick={() => setListTab('past')}
                        style={{ padding: '10px 24px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', background: listTab === 'past' ? 'linear-gradient(90deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: listTab === 'past' ? '0 4px 15px rgba(188,19,254,0.4)' : 'none' }}
                    >
                        ⏳ Korábbi bulik
                    </button>
                </div>

                {/* ── Térkép ───────────────────────────────────────── */}
                <div className="map-wrapper-premium">
                    <Map
                        center={mapCenter}
                        zoom={mapZoom}
                        markers={markers}
                    />
                    <div className="map-overlay-info">
                        <i className="fas fa-info-circle"></i> Kattints a jelölőkre a részletekért
                    </div>
                </div>

                {/* ── Event lista ───────────────────────────────────── */}
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
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={() => handleEditClick(event)}
                                onDelete={() => handleDeleteClick(event.id)}
                                onCardClick={() => handleCardClick(event)}
                                onReviewClick={handleReviewClick}
                                canEdit={user?.role === 'admin'}
                                canDelete={user?.role === 'admin'}
                                attendeeCount={event.attendeeCount ?? 0}
                                isAttending={event.isAttending ?? false}
                                isFavorite={event.isFavorite ?? false}
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <p>Nincs találat a megadott feltételekkel.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Új/Szerkesztés buli modal ─────────────────────────────────── */}
            <CreateEventModal
                open={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setEventToEdit(null);
                }}
                onCreated={handleEventCreated}
                eventToEdit={eventToEdit}
            />

            {/* ── Értékelés modal ─────────────────────────────────── */}
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                event={eventToReview}
                onReviewSuccess={handleReviewSuccess}
            />
        </section>
    );
};

export default Events;
