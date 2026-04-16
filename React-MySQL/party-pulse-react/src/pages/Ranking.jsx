import React, { useState, useEffect } from 'react';
import { useRanking } from '../hooks/useRanking';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/apiConfig';
import '../css/Ranking.css';

const Ranking = () => {
    const { ranking: rankings, loading, error, fetchRanking } = useRanking();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const generateAvatarColor = (name) => {
        if (!name) return '#bc13fe';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    };

    return (
        <section id="ranking" className="page active">
            <div className="container">
                <div className="ranking-card">
                    <h2><i className="fas fa-crown"></i> Party Legendák</h2>
                    <p className="ranking-header-info">Indítsd be az éjszakát és kerülj a toplista élére!</p>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#bc13fe' }}></i>
                            <p style={{ marginTop: '15px' }}>Ranglista betöltése...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', color: '#ff4444', padding: '40px' }}>
                            <i className="fas fa-exclamation-circle fa-2x"></i>
                            <p style={{ marginTop: '15px' }}>{error}</p>
                        </div>
                    ) : (
                        <div className="ranking-list">
                            {rankings.map((user) => {
                                const isMe = currentUser && parseInt(currentUser.userId) === parseInt(user.userId);
                                return (
                                    <div
                                        key={user.rank}
                                        className={`ranking-item ${user.rank <= 3 ? `top-${user.rank}` : ''} ${isMe ? 'is-me' : ''}`}
                                    >
                                        <div className="rank-number">
                                            {user.rank === 1 ? <i className="fas fa-award"></i> : `${user.rank}.`}
                                        </div>

                                        <div
                                            className="ranking-avatar-wrapper"
                                            style={{
                                                backgroundColor: user.profilePictureUrl ? 'transparent' : generateAvatarColor(user.username)
                                            }}
                                        >
                                            {user.profilePictureUrl ? (
                                                <img src={`${API_BASE_URL}${user.profilePictureUrl}`} alt={user.username} />
                                            ) : (
                                                <span>{getInitials(user.username)}</span>
                                            )}
                                        </div>

                                        <div className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            {user.username}
                                            {isMe && <span className="me-badge">TE</span>}
                                            {user.pinnedBadges && user.pinnedBadges.length > 0 && (
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    {user.pinnedBadges.map(badge => (
                                                        <img 
                                                            key={`pinned-${badge.badgeID}`} 
                                                            src={badge.iconUrl || 'https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858004/Newcomer_badge_vcujay.png'} 
                                                            alt={badge.name} 
                                                            title={badge.name}
                                                            style={{ width: '24px', height: '24px', objectFit: 'contain', cursor: 'help' }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="stat-item parties">
                                            <span className="stat-value">{user.events}</span>
                                            <span className="stat-label">Buli</span>
                                        </div>

                                        <div className="score-badge">
                                            <div className="stat-item">
                                                <span className="score-value">{user.points}</span>
                                                <span className="stat-label">Pont</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Ranking;
