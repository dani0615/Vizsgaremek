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
        <div className="messages-page page">
            <div className="messages-header">
                <h1>Üzenetek</h1>
                <p>Beszélgess a matcheiddel és szervezzetek közös bulit!</p>
                <button className="btn-new-chat" onClick={() => navigate('/chat/new')}>
                    Új beszélgetés indítása
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
                <div className="messages-list">
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
    );
};

export default Messages;
