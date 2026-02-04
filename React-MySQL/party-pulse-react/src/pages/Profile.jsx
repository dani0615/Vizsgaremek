import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient, API_BASE_URL } from '../services/apiConfig';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Szerkesztési állapotok
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        email: '',
        displayName: '',
        bio: '',
        gender: '',
        birthDate: '',
        lookingFor: ''
    });

    // Jelszó váltás állapotok
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Életkor korlátozás: minimum 16 év
    const today = new Date();
    const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const maxDate = sixteenYearsAgo.toISOString().split('T')[0];

    useEffect(() => {
        // Megvárjuk, amíg az AuthContext befejezi a token ellenőrzést
        if (authLoading) return;

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchProfileData();
    }, [isAuthenticated, authLoading, navigate]);

    const fetchProfileData = async () => {
        try {
            setProfileLoading(true);
            setError(null);
            const response = await apiClient.get('/api/User/me');
            setProfileData(response.data);
            // Szerkesztési adatok alaphelyzetbe állítása
            setEditData({
                email: response.data.email || '',
                displayName: response.data.displayName || '',
                bio: response.data.bio || '',
                gender: response.data.gender || 'prefer_not_to_say',
                birthDate: response.data.birthDate ? response.data.birthDate.split('T')[0] : '',
                lookingFor: response.data.lookingFor || 'both'
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Hiba történt a profil betöltése során.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setProfileLoading(true);
            await apiClient.post('/api/User/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchProfileData();
            setSuccessMessage('Profilkép sikeresen frissítve!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error uploading avatar:', err);
            setError('Hiba történt a kép feltöltése során.');
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
            setError(err.response?.data || 'Hiba történt a frissítés során.');
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
                            backgroundColor: '#00C851',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            {successMessage}
                        </div>
                    )}

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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
