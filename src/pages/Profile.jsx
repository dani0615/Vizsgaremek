import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient, API_BASE_URL } from '../services/apiConfig';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import ReviewModal from '../components/ReviewModal';
import { useEvents } from '../hooks/useEvents';
import { processImage } from '../utils/ImageProcessor';
import '../css/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { events: allEvents, loading: allEventsLoading, fetchEvents } = useEvents();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [eventToReview, setEventToReview] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);

    const handleReviewClick = (event) => {
        setEventToReview(event);
        setShowReviewModal(true);
    };

    const handleReviewSuccess = () => {
        fetchEvents();
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

    const handleEventCreated = () => {
        fetchEvents();
    };

    // Split attended events into upcoming and past
    const myUpcomingEvents = allEvents.filter(e => e.isAttending && !e.hasEnded);
    const myPastEvents = allEvents.filter(e => e.isAttending && e.hasEnded);
    const myFavorites = allEvents.filter(e => e.isFavorite);
    const myEventsLoading = allEventsLoading;
    const myFavoritesLoading = allEventsLoading;

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        email: '',
        displayName: '',
        bio: '',
        gender: '',
        birthDate: '',
        lookingFor: ''
    });

    const [availableBadges, setAvailableBadges] = useState([]);
    const [badgesLoading, setBadgesLoading] = useState(true);
    const [pinnedBadges, setPinnedBadges] = useState([]);

    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const today = new Date();
    const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const maxDate = sixteenYearsAgo.toISOString().split('T')[0];

    useEffect(() => {

        if (authLoading) return;

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchProfileData();
        fetchEvents();
        fetchAvailableBadges();
    }, [isAuthenticated, authLoading, navigate, fetchEvents]);

    const fetchAvailableBadges = async () => {
        try {
            setBadgesLoading(true);
            const response = await apiClient.get('/api/Badge/all');
            setAvailableBadges(response.data);
        } catch (err) {
            console.error('Error fetching badges:', err);
        } finally {
            setBadgesLoading(false);
        }
    };

    const handleCardClick = (event) => {
        // Navigate to the events page and filter by this event's name
        navigate(`/events?keyword=${encodeURIComponent(event.name)}`);
    };

    // Helper functions for formatting (replicated from useEvents for consistency)
    const isDummyImage = (url) => {
        if (!url) return true;
        const low = url.toLowerCase();
        return low.includes('rocknight') || low.includes('jazz.jpg') || low.includes('techno') || low.includes('placeholder');
    };

    const extractCityFromAddress = (address) => {
        if (!address) return 'Borsod';
        const addrLower = address.toLowerCase();
        if (addrLower.includes('miskolc')) return 'Miskolc';
        if (addrLower.includes('mezőkövesd')) return 'Mezőkövesd';
        if (addrLower.includes('ózd')) return 'Ózd';
        if (addrLower.includes('sárospatak')) return 'Sárospatak';
        if (addrLower.includes('budapest')) return 'Budapest';
        const parts = address.split(',');
        return parts[0].trim();
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return 'Hamarosan';
        try {
            const date = new Date(dateTime);
            if (isNaN(date.getTime())) return dateTime;
            return date.toLocaleDateString('hu-HU', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch (e) { return dateTime; }
    };

    const getPlaceholderImage = (index) => {
        const images = [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
            'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=600',
            'https://images.unsplash.com/photo-1514525253361-bee8718a7439?w=600',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600'
        ];
        return images[index % images.length];
    };

    const fetchProfileData = async () => {
        try {
            setProfileLoading(true);
            setError(null);
            const response = await apiClient.get('/api/User/me');
            setProfileData(response.data);

            setEditData({
                email: response.data.email || '',
                displayName: response.data.displayName || '',
                bio: response.data.bio || '',
                gender: response.data.gender || 'prefer_not_to_say',
                birthDate: response.data.birthDate ? response.data.birthDate.split('T')[0] : '',
                lookingFor: response.data.lookingFor || 'both'
            });

            if (response.data.badges) {
                setPinnedBadges(response.data.badges.filter(b => b.isPinned).map(b => b.badgeID));
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Hiba történt a profil betöltése során.');
        } finally {
            setProfileLoading(false);
        }
    };

    const togglePinBadge = (badgeId) => {
        setPinnedBadges(prev => {
            if (prev.includes(badgeId)) return prev.filter(id => id !== badgeId);
            if (prev.length >= 3) {
                alert("Maximum 3 jelvényt tűzhetsz ki!");
                return prev;
            }
            return [...prev, badgeId];
        });
    };

    const savePinnedBadges = async () => {
        try {
            await apiClient.post('/api/User/pin-badges', pinnedBadges);
            setSuccessMessage("Kitűzött jelvények mentve!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch(err) {
            console.error("Error saving pinned badges:", err);
            setError("Hiba a jelvények mentésekor.");
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;


        if (!file.type.startsWith('image/')) {
            setError('Csak képfájlok feltöltése engedélyezett (jpg, png, stb.)!');
            setTimeout(() => setError(null), 5000);
            return;
        }


        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('A kép mérete túl nagy! A maximális megengedett méret 5MB.');
            setTimeout(() => setError(null), 5000);
            return;
        }

        const formData = new FormData();
        try {
            setProfileLoading(true);
            setError(null);
            
            // Optimalizálás (Átméretezés + WebP)
            const processedFile = await processImage(file, 500, 500, 0.82);
            formData.append('file', processedFile);

            await apiClient.post('/api/User/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchProfileData();
            setSuccessMessage('Profilkép sikeresen frissítve!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error uploading avatar:', err);

            let errorMessage = 'Hiba történt a kép feltöltése során.';
            const responseData = err.response?.data;

            if (err.response?.status === 500) {
                errorMessage = 'Szerveroldali hiba történt. Kérjük, próbáld meg később vagy válassz egy másik képet.';
            } else if (typeof responseData === 'string') {
                if (responseData.length > 200 || responseData.includes('<!DOCTYPE html>') || responseData.includes('<html>')) {
                    errorMessage = 'A fájl nem támogatott vagy túl nagy. Kérjük, válassz egy másik képet.';
                } else {
                    errorMessage = responseData;
                }
            } else if (responseData?.message) {
                errorMessage = responseData.message;
            }

            setError(errorMessage);
            setTimeout(() => setError(null), 7000);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setProfileLoading(true);
            setError(null);
            await apiClient.put('/api/User/profile', editData);
            await fetchProfileData();
            setIsEditing(false);
            setSuccessMessage('Profil sikeresen frissítve!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);

            let errorMessage = 'Hiba történt a frissítés során.';
            const responseData = err.response?.data;

            if (err.response?.status === 500) {
                errorMessage = 'Szerveroldali hiba történt a mentés során.';
            } else if (typeof responseData === 'string') {
                if (responseData.length > 200 || responseData.includes('<!DOCTYPE html>') || responseData.includes('<html>')) {
                    errorMessage = 'A mentés sikertelen volt. Kérjük, ellenőrizd az adatokat.';
                } else {
                    errorMessage = responseData;
                }
            }

            setError(errorMessage);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('A két jelszó nem egyezik!');
            return;
        }

        try {
            setPasswordLoading(true);
            await apiClient.post('/api/User/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess('Jelszó sikeresen megváltoztatva!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setShowPasswordChange(false), 2000);
        } catch (err) {
            setPasswordError(err.response?.data || 'Hiba történt a jelszóváltoztatás során.');
        } finally {
            setPasswordLoading(false);
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

    const formatCriteria = (criteriaJson) => {
        try {
            const criteria = JSON.parse(criteriaJson);
            switch (criteria.type) {
                case 'registration': return 'Regisztrálj az oldalra';
                case 'attendance': return `Vegyél részt legalább ${criteria.min} eseményen`;
                case 'age':
                    if (criteria.months) return `Légy tag legalább ${criteria.months} hónapja`;
                    if (criteria.years) return `Légy tag legalább ${criteria.years} éve`;
                    return 'Hosszabb ideje légy tag';
                default: return 'Különleges feladat teljesítése';
            }
        } catch (e) {
            return 'Küldetés teljesítése';
        }
    };

    if (authLoading || profileLoading) {
        return (
            <section className="page active profile-page">
                <div className="container">
                    <div className="profile-container">
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <div className="loader" style={{
                                border: '4px solid rgba(188, 19, 254, 0.1)',
                                borderTop: '4px solid var(--primary)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 20px'
                            }}></div>
                            <style>{`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>
                            <p>{authLoading ? 'Azonosítás...' : 'Profil betöltése...'}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error && !profileData) {
        return (
            <section className="page active profile-page">
                <div className="container">
                    <div className="profile-container">
                        <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>
                            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
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
        ? `${API_BASE_URL}${profileData.profilePictureUrl}${profileData.lastModified ? `?t=${new Date(profileData.lastModified).getTime()}` : ''}`
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
                                <label className="avatar-edit-overlay">
                                    <i className="fas fa-camera"></i>
                                    <input type="file" onChange={handleAvatarUpload} hidden accept="image/*" />
                                </label>
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
                                className="btn-neon-outline"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'}`}></i> {isEditing ? 'Mégse' : 'Szerkesztés'}
                            </button>
                            {!isEditing && (
                                <button
                                    className="btn-danger"
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt"></i> Kijelentkezés
                                </button>
                            )}
                        </div>
                    </div>

                    {successMessage && (
                        <div style={{
                            backgroundColor: 'rgba(0, 200, 81, 0.9)',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 4px 15px rgba(0, 200, 81, 0.3)',
                            animation: 'slideDown 0.3s ease-out'
                        }}>
                            <i className="fas fa-check-circle" style={{ marginRight: '10px' }}></i>
                            {successMessage}
                        </div>
                    )}

                    {error && profileData && (
                        <div style={{
                            backgroundColor: 'rgba(255, 68, 68, 0.9)',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 4px 15px rgba(255, 68, 68, 0.3)',
                            animation: 'slideDown 0.3s ease-out'
                        }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: '10px' }}></i>
                            {error}
                        </div>
                    )}

                    <style>{`
                        @keyframes slideDown {
                            from { transform: translateY(-20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>

                    <div className="profile-content">
                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                                <div className="detail-section">
                                    <h3>Profil szerkesztése</h3>
                                    <div className="form-group">
                                        <label>Megjelenítendő név</label>
                                        <input
                                            type="text"
                                            value={editData.displayName}
                                            onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                                            placeholder="Megjelenítendő név"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email cím</label>
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Bio</label>
                                        <textarea
                                            value={editData.bio}
                                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                            placeholder="Írj magadról pár szót..."
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <div className="info-grid">
                                        <div className="form-group">
                                            <label>Nem</label>
                                            <select
                                                value={editData.gender}
                                                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                            >
                                                <option value="male">Férfi</option>
                                                <option value="female">Nő</option>
                                                <option value="other">Egyéb</option>
                                                <option value="prefer_not_to_say">Nem kívánom megadni</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Születési dátum</label>
                                            <input
                                                type="date"
                                                value={editData.birthDate}
                                                onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                                                max={maxDate}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Keresek</label>
                                            <select
                                                value={editData.lookingFor}
                                                onChange={(e) => setEditData({ ...editData, lookingFor: e.target.value })}
                                            >
                                                <option value="friends">Barátokat</option>
                                                <option value="party_buddies">Party arcokat</option>
                                                <option value="both">Mindkettőt</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn-pulse" disabled={profileLoading}>
                                            {profileLoading ? 'Mentés...' : 'Változtatások mentése'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
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
                                            <span className="info-label">Nem:</span>
                                            <span className="info-value">
                                                {profileData.gender === 'male' ? 'Férfi' :
                                                    profileData.gender === 'female' ? 'Nő' :
                                                        profileData.gender === 'other' ? 'Egyéb' : 'Nem megadott'}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Születési idő:</span>
                                            <span className="info-value">
                                                {profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('hu-HU') : 'Nincs megadva'}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Keresek:</span>
                                            <span className="info-value">
                                                {profileData.lookingFor === 'friends' ? 'Barátokat' :
                                                    profileData.lookingFor === 'party_buddies' ? 'Party arcokat' : 'Mindkettőt'}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Szerepkör:</span>
                                            <span className="info-value">{profileData.role || 'Felhasználó'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section badges-section">
                                    <h3>Jelvények & Mérföldkövek <i className="fas fa-medal" style={{ color: '#bc13fe', marginLeft: '8px' }}></i></h3>
                                    {badgesLoading ? (
                                        <div className="mini-loader">Jelvények betöltése...</div>
                                    ) : (
                                        <div>
                                            <p style={{ textAlign: 'center', marginBottom: '15px', color: 'var(--text-muted)' }}>Kattints a megszerzett jelvényekre, hogy kitűzd őket (max 3 db)!</p>
                                            <div className="badges-grid">
                                                {availableBadges.map(badge => (
                                                    <div 
                                                        key={badge.badgeID} 
                                                        className={`badge-item ${badge.isEarned ? 'earned' : 'not-earned'} ${pinnedBadges.includes(badge.badgeID) ? 'pinned' : ''}`}
                                                        onClick={() => badge.isEarned && togglePinBadge(badge.badgeID)}
                                                        style={{ 
                                                            cursor: badge.isEarned ? 'pointer' : 'default',
                                                            border: pinnedBadges.includes(badge.badgeID) ? '2px solid var(--primary)' : '',
                                                            transform: pinnedBadges.includes(badge.badgeID) ? 'scale(1.05)' : ''
                                                        }}
                                                    >
                                                    <div className="badge-desc-tooltip">
                                                        <strong>{badge.name}</strong>
                                                        <p style={{ margin: '5px 0', fontSize: '0.8rem', opacity: 0.8 }}>{badge.description}</p>
                                                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: 'var(--accent)' }}>
                                                            <i className="fas fa-tasks"></i> {formatCriteria(badge.criteria)}
                                                        </div>
                                                    </div>

                                                    <div className="badge-icon-wrapper">
                                                        <img 
                                                            src={badge.iconUrl || 'https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858004/Newcomer_badge_vcujay.png'} 
                                                            alt={badge.name} 
                                                            className="badge-icon"
                                                        />
                                                        {badge.isEarned && !pinnedBadges.includes(badge.badgeID) && (
                                                            <div className="badge-status-icon">
                                                                <i className="fas fa-check"></i>
                                                            </div>
                                                        )}
                                                        {pinnedBadges.includes(badge.badgeID) && (
                                                            <div className="badge-status-icon" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                                                                <i className="fas fa-thumbtack"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="badge-info">
                                                        <h4>{badge.name}</h4>
                                                        <span className="badge-criteria">
                                                            {badge.isEarned ? 'Teljesítve!' : formatCriteria(badge.criteria)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            </div>
                                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                                <button className="btn-pulse" onClick={savePinnedBadges}>Kitűzött jelvények mentése</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-section">
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button
                                            className="btn-neon-outline"
                                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                                            style={{ width: 'auto' }}
                                        >
                                            <i className="fas fa-key"></i> {showPasswordChange ? 'Mégse' : 'Jelszó megváltoztatása'}
                                        </button>
                                    </div>

                                    {showPasswordChange && (
                                        <div className="password-change-container">
                                            <form onSubmit={handleChangePassword} className="password-change-form">
                                                <h4 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>Jelszó frissítése</h4>
                                                {passwordError && <p style={{ color: '#ff4444', marginBottom: '10px', textAlign: 'center' }}>{passwordError}</p>}
                                                {passwordSuccess && <p style={{ color: '#00C851', marginBottom: '10px', textAlign: 'center' }}>{passwordSuccess}</p>}
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        placeholder="Jelenlegi jelszó"
                                                        value={passwordData.oldPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        placeholder="Új jelszó"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        placeholder="Új jelszó megerősítése"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-actions">
                                                    <button type="submit" className="btn-pulse" disabled={passwordLoading}>
                                                        {passwordLoading ? 'Folyamatban...' : 'Jelszó mentése'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-section my-events-section">
                                    <h3>Események, ahol ott leszek</h3>
                                    {myEventsLoading ? (
                                        <div className="mini-loader">Betöltés...</div>
                                    ) : myUpcomingEvents.length > 0 ? (
                                        <div className="event-grid">
                                            {myUpcomingEvents.map(event => (
                                                <EventCard
                                                    key={event.id}
                                                    event={event}
                                                    isAttending={true}
                                                    attendeeCount={event.attendeeCount ?? 0}
                                                    isFavorite={event.isFavorite ?? false}
                                                    onReviewClick={handleReviewClick}
                                                    onCardClick={() => handleCardClick(event)}
                                                    onEdit={() => handleEditClick(event)}
                                                    onDelete={() => handleDeleteClick(event.id)}
                                                    canEdit={user?.role === 'admin'}
                                                    canDelete={user?.role === 'admin'}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-events-placeholder">
                                            <i className="fas fa-calendar-times"></i>
                                            <p>Nincs közelgő eseményed.</p>
                                            <button className="btn-pulse" onClick={() => navigate('/events')}>Böngéssz az események között</button>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-section my-events-section" style={{ marginTop: '30px' }}>
                                    <h3>Események amiken részt vettem <i className="fas fa-history" style={{ color: '#bc13fe', marginLeft: '8px' }}></i></h3>
                                    {myEventsLoading ? (
                                        <div className="mini-loader">Betöltés...</div>
                                    ) : myPastEvents.length > 0 ? (
                                        <div className="event-grid">
                                            {myPastEvents.map(event => (
                                                <EventCard
                                                    key={`past-${event.id}`}
                                                    event={event}
                                                    isAttending={true}
                                                    attendeeCount={event.attendeeCount ?? 0}
                                                    isFavorite={event.isFavorite ?? false}
                                                    onReviewClick={handleReviewClick}
                                                    onCardClick={() => handleCardClick(event)}
                                                    onEdit={() => handleEditClick(event)}
                                                    onDelete={() => handleDeleteClick(event.id)}
                                                    canEdit={user?.role === 'admin'}
                                                    canDelete={user?.role === 'admin'}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-events-placeholder">
                                            <i className="fas fa-history" style={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.2)', marginBottom: '15px' }}></i>
                                            <p>Még nem vettél részt egyetlen eseményen sem.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-section my-events-section" style={{ marginTop: '30px' }}>
                                    <h3>Kedvenc eseményeim <i className="fas fa-heart" style={{ color: '#bc13fe', marginLeft: '8px' }}></i></h3>
                                    {myFavoritesLoading ? (
                                        <div className="mini-loader">Betöltés...</div>
                                    ) : myFavorites.length > 0 ? (
                                        <div className="event-grid">
                                            {myFavorites.map(event => (
                                                <EventCard
                                                    key={`fav-${event.id}`}
                                                    event={event}
                                                    isFavorite={true}
                                                    isAttending={event.isAttending ?? false}
                                                    attendeeCount={event.attendeeCount ?? 0}
                                                    onReviewClick={handleReviewClick}
                                                    onCardClick={() => handleCardClick(event)}
                                                    onEdit={() => handleEditClick(event)}
                                                    onDelete={() => handleDeleteClick(event.id)}
                                                    canEdit={user?.role === 'admin'}
                                                    canDelete={user?.role === 'admin'}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-events-placeholder">
                                            <i className="far fa-heart" style={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.2)', marginBottom: '15px' }}></i>
                                            <p>Még nincsenek kedvenc eseményeid.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                event={eventToReview}
                onReviewSuccess={handleReviewSuccess}
            />

            <CreateEventModal
                open={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setEventToEdit(null);
                }}
                onCreated={handleEventCreated}
                eventToEdit={eventToEdit}
            />
        </section>
    );
};

export default Profile;
