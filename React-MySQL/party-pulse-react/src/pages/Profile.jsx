import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient, API_BASE_URL } from '../services/apiConfig';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchProfileData();
    }, [isAuthenticated, navigate]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get('/api/User/me');
            setProfileData(response.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Hiba történt a profil betöltése során.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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

    if (loading) {
        return (
            <section className="page active profile-page">
                <div className="container">
                    <div className="profile-container">
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>Betöltés...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page active profile-page">
                <div className="container">
                    <div className="profile-container">
                        <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>
                            <p>{error}</p>
                            <button
                                className="btn-pulse"
                                onClick={fetchProfileData}
                                style={{ marginTop: '20px' }}
                            >
                                Újrapróbálkozás
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!profileData) {
        return null;
    }

    const avatarUrl = profileData.profilePictureUrl
        ? `${API_BASE_URL}${profileData.profilePictureUrl}`
        : null;
    const avatarBgColor = generateAvatarColor(profileData.username);
    const displayName = profileData.displayName || profileData.username;

    return (
        <section className="page active profile-page">
            <div className="container">
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-avatar-section">
                            <div
                                className="profile-avatar"
                                style={{
                                    backgroundColor: avatarUrl ? 'transparent' : avatarBgColor
                                }}
                            >
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={profileData.username} />
                                ) : (
                                    <span className="avatar-initials">
                                        {getInitials(displayName)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="profile-info">
                            <h1>{displayName}</h1>
                            <p className="profile-email">{profileData.email}</p>
                            <p className="profile-role">{profileData.role || 'Felhasználó'}</p>
                            {profileData.points !== undefined && (
                                <p className="profile-points">
                                    <i className="fas fa-star"></i> {profileData.points} pont
                                </p>
                            )}
                        </div>

                        <div className="profile-actions">
                            <button
                                className="btn-danger"
                                onClick={handleLogout}
                            >
                                <i className="fas fa-sign-out-alt"></i> Kijelentkezés
                            </button>
                        </div>
                    </div>

                    <div className="profile-content">
                        <div className="profile-details">
                            <div className="detail-section">
                                <h3>Rólam</h3>
                                <p>{profileData.bio || 'Még nincs bio...'}</p>
                            </div>

                            <div className="detail-section">
                                <h3>Profil információk</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Felhasználónév:</span>
                                        <span className="info-value">{profileData.username}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{profileData.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Szerepkör:</span>
                                        <span className="info-value">{profileData.role || 'Felhasználó'}</span>
                                    </div>
                                    {profileData.points !== undefined && (
                                        <div className="info-item">
                                            <span className="info-label">Pontok:</span>
                                            <span className="info-value">{profileData.points}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
