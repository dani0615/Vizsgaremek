import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiConfig';
import { useAuth } from '../context/AuthContext';
import '../css/Messages.css';

const Messages = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchMatches = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/Matching/Matches');
                setMatches(res.data);
            } catch (err) {
                console.error('Hiba a matchek betöltésekor:', err);
                setError('Nem sikerült betölteni a beszélgetéseket.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [isAuthenticated, authLoading, navigate]);

    if (!isAuthenticated) return null;

    return (
        <div className="messages-page page" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
            {/* Background glowing decorations */}
            <div style={{ position: 'absolute', top: '5%', left: '15%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(180px)', opacity: '0.15', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '350px', height: '350px', background: 'var(--accent)', filter: 'blur(160px)', opacity: '0.12', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

            <div className="messages-container" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>
                <div className="messages-header" style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px', textShadow: '0 4px 20px rgba(188, 19, 254, 0.4)' }}>Üzenetek 💬</h1>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem', marginBottom: '2rem' }}>Beszélgess a matcheiddel és szervezzetek közös bulit!</p>
                    <button className="btn-new-chat" onClick={() => navigate('/chat/new')} style={{ padding: '14px 30px', fontSize: '1.05rem', boxShadow: '0 8px 30px rgba(188, 19, 254, 0.35)' }}>
                        ✨ Új beszélgetés indítása
                    </button>
                </div>

            {loading ? (
                <div className="buddies-loading">
                    <div className="spinner" />
                    <span>Beszélgetések betöltése...</span>
                </div>
            ) : error ? (
                <div className="messages-empty">
                    <div className="empty-icon">⚠️</div>
                    <p>{error}</p>
                </div>
            ) : matches.length === 0 ? (
                <div className="messages-empty">
                    <div className="empty-icon">💬</div>
                    <p>Még nincsenek matcheid. Kezdj el böngészni!</p>
                    <Link to="/buddies" className="btn-goto-buddies">
                        Party Buddies keresése
                    </Link>
                </div>
            ) : (
                <div className="messages-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
                    {matches.map((match) => (
                        <Link 
                            to={`/chat/${match.matchID}`} 
                            key={match.matchID} 
                            className="match-item"
                        >
                            {match.partner.profilePictureBase64 ? (
                                <img 
                                    src={match.partner.profilePictureBase64} 
                                    alt={match.partner.name} 
                                    className="match-avatar" 
                                />
                            ) : (
                                <div className="match-avatar-placeholder">
                                    {match.partner.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="match-info">
                                <div className="match-name">{match.partner.name}</div>
                                <div className="match-date">
                                    Match: {new Date(match.matchedAt).toLocaleDateString('hu-HU')}
                                </div>
                            </div>
                            <div className="match-arrow">
                                <i className="fas fa-chevron-right"></i>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default Messages;
