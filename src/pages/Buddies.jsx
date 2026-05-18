import React, { useState, useEffect, useRef, useCallback } from 'react';
import TinderCard from 'react-tinder-card';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiConfig';
import { useAuth } from '../context/AuthContext';
import { useMatchNotifications } from '../context/MatchNotificationContext';
import '../css/Buddies.css';
import '../css/MatchToast.css';

/* ── helpers ── */
const getAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const generateAvatarColor = (name) => {
    if (!name) return '#bc13fe';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 45%)`;
};

const generateAvatarColor2 = (name) => {
    if (!name) return '#00f3ff';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = (Math.abs(hash) + 120) % 360;
    return `hsl(${hue}, 80%, 55%)`;
};

/* ── Confetti particle component ── */
const MatchConfetti = () => {
    const colors = ['#bc13fe', '#00f3ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff922b'];
    const particles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.8}s`,
        duration: `${1.2 + Math.random() * 1}s`,
        size: `${6 + Math.random() * 10}px`,
        rotate: `${Math.random() * 360}deg`,
    }));
    return (
        <div className="confetti-container" aria-hidden>
            {particles.map(p => (
                <div
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: p.left,
                        background: p.color,
                        width: p.size,
                        height: p.size,
                        animationDelay: p.delay,
                        animationDuration: p.duration,
                        '--rotate': p.rotate,
                    }}
                />
            ))}
        </div>
    );
};

/* ── Main component ── */
const Buddies = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { newMatches, markAllSeen } = useMatchNotifications();
    const [bannerDismissed, setBannerDismissed] = useState(false);

    const [candidates, setCandidates] = useState([]);
    const [allMatches, setAllMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeHint, setSwipeHint] = useState(null); // 'left' | 'right' | null
    const [swiping, setSwiping] = useState(false);
    const [cardKey, setCardKey] = useState(0); // force re-mount for new card

    const cardRef = useRef(null);

    const fetchRecommendations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/Matching/Recommendations?limit=20');
            const data = res.data;
            setCandidates(data);
            setCurrentIndex(0);
            setCardKey(k => k + 1);

            // Fetch existing matches
            const matchRes = await apiClient.get('/Matching/Matches');
            setAllMatches(matchRes.data);
        } catch {
            setError('Nem sikerült betölteni az ajánlásokat.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Wait for auth context to finish loading before checking authentication
        if (authLoading) return;
        if (!isAuthenticated) { navigate('/login'); return; }
        // Mark notifications as seen when landing on buddies page
        markAllSeen();
        setBannerDismissed(false);
        fetchRecommendations();
    }, [isAuthenticated, authLoading, navigate, fetchRecommendations]);

    const sendSwipe = async (candidate, isLike) => {
        try {
            const res = await apiClient.post('/Matching/Swipe', { targetUserId: candidate.userID, isLike });
            const data = res.data;
            if (data.isMatch) {
                setMatchResult({
                    name: candidate?.name || 'Ismeretlen',
                    avatar: candidate?.profilePictureBase64 || null,
                    chatRoomId: data.chatRoomId,
                    matchId: data.matchId,
                });
            }
        } catch (err) {
            console.error('Swipe hiba:', err);
        }
    };

    const advanceCard = () => {
        const next = currentIndex + 1;
        if (next < candidates.length) {
            setCurrentIndex(next);
            setCardKey(k => k + 1);
        } else {
            // no more cards
            setCurrentIndex(candidates.length); // sentinel
        }
        setSwiping(false);
        setSwipeHint(null);
    };

    const onSwipe = (direction, candidate) => {
        setSwipeHint(direction);
        const isLike = direction === 'right';
        sendSwipe(candidate, isLike);
    };

    const triggerSwipe = async (dir) => {
        if (swiping || !cardRef.current) return;
        setSwiping(true);
        setSwipeHint(dir);
        await cardRef.current.swipe(dir);
    };

    const onCardLeftScreen = () => {
        advanceCard();
    };

    const candidate = candidates[currentIndex];
    const hasMore = currentIndex < candidates.length;
    const hasSidebar = !loading && allMatches.length > 0;

    if (!isAuthenticated) return null;

    return (
        <div className="buddies-page page">
            <div className="buddies-header">
                <h1>🎉 Party Buddies</h1>
                <p>Találj bulitársat a következő eseményedre!</p>
            </div>

            <div className="buddies-app-container" style={{ 
                ...(hasSidebar ? { justifyContent: 'flex-start', marginLeft: '5%', gap: '6rem' } : {})
            }}>
                {/* ── Sidebar: All Matches ── */}
                {hasSidebar && (
                    <aside className="buddies-sidebar">
                        <div className="buddies-sidebar-inner">
                            <h2 className="buddies-sidebar-title">Matcheid ({allMatches.length})</h2>
                            <div className="buddies-matches-grid">
                                {allMatches.map(m => (
                                    <div key={m.matchID} className="buddies-match-card" onClick={() => navigate(`/chat/${m.matchID}`)}>
                                        <div className="buddies-match-avatar-wrapper">
                                            {m.partner?.profilePictureBase64 ? (
                                                <img src={m.partner.profilePictureBase64} alt={m.partner.name} className="buddies-match-avatar-img" />
                                            ) : (
                                                <div className="buddies-match-avatar-placeholder" style={{ background: `linear-gradient(135deg, ${generateAvatarColor(m.partner?.name)}, ${generateAvatarColor2(m.partner?.name)})` }}>
                                                    {getInitials(m.partner?.name)}
                                                </div>
                                            )}
                                        </div>
                                        <span className="buddies-match-username">{m.partner?.name?.split(' ')[0]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* ── Main content: Banner + Swiper ── */}
                <main className="buddies-main-content">
                    {/* ── New-match banner ── */}
                    {!bannerDismissed && newMatches.length > 0 && (
                        <div className="buddies-new-match-banner">
                            <div className="buddies-banner__avatars">
                                {newMatches.slice(0, 3).map(m => (
                                    m.partner?.profilePictureBase64
                                        ? <img key={m.matchID} src={m.partner.profilePictureBase64} alt={m.partner.name} className="buddies-banner__avatar" style={{ marginLeft: newMatches.indexOf(m) > 0 ? '-10px' : 0 }} />
                                        : <div key={m.matchID} className="buddies-banner__avatar buddies-banner__avatar--placeholder" style={{ marginLeft: newMatches.indexOf(m) > 0 ? '-10px' : 0 }}>
                                            {m.partner?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                ))}
                            </div>
                            <div className="buddies-banner__text">
                                <div className="buddies-banner__label">💜 Új match{newMatches.length > 1 ? 'ek' : ''}!</div>
                                <div className="buddies-banner__names">
                                    {newMatches.slice(0, 2).map(m => m.partner?.name).join(', ')}
                                    {newMatches.length > 2 && ` +${newMatches.length - 2} másik`}
                                </div>
                            </div>
                            {newMatches.length === 1 && (
                                <button
                                    className="match-toast__btn match-toast__btn--chat"
                                    style={{ flex: 'none', marginRight: '0.4rem' }}
                                    onClick={() => navigate(`/chat/${newMatches[0].matchID}`)}
                                >
                                    💬
                                </button>
                            )}
                            <button className="buddies-banner__close" onClick={() => setBannerDismissed(true)}>✕</button>
                        </div>
                    )}

                    {loading && (
                        <div className="buddies-loading">
                            <div className="spinner" />
                            <span>Profilok betöltése...</span>
                        </div>
                    )}

                    {error && (
                        <div className="buddies-empty">
                            <div className="empty-icon">⚠️</div>
                            <p>{error}</p>
                            <button className="swipe-btn swipe-btn-refresh" style={{ width: 'auto', borderRadius: '50px', padding: '10px 24px', marginTop: '1rem' }} onClick={fetchRecommendations}>Újrapróbálás</button>
                        </div>
                    )}

                    {!loading && !error && !hasMore && (
                        <div className="buddies-empty">
                            <div className="empty-icon">🎭</div>
                            <p>Nincs több ajánlás. Gyere vissza később!</p>
                            <button
                                className="swipe-btn-refresh"
                                style={{ width: 'auto', height: 'auto', marginTop: '1.5rem', padding: '12px 28px', borderRadius: '50px', border: '2px solid rgba(255,255,255,0.25)', background: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.95rem' }}
                                onClick={fetchRecommendations}
                            >
                                ↺ Újratöltés
                            </button>
                        </div>
                    )}

                    {!loading && !error && hasMore && candidate && (
                        <div className="swiper-section">
                            {/* Progress dots */}
                            <div className="card-progress">
                                <span>{currentIndex + 1} / {candidates.length}</span>
                            </div>

                            <div className="card-stack-container">
                                {/* Peek of next card behind */}
                                {currentIndex + 1 < candidates.length && (
                                    <div className="card-peek" aria-hidden />
                                )}

                                <TinderCard
                                    key={cardKey}
                                    ref={cardRef}
                                    onSwipe={(dir) => onSwipe(dir, candidate)}
                                    onCardLeftScreen={onCardLeftScreen}
                                    preventSwipe={['up', 'down']}
                                    className="swipe-card"
                                    swipeRequirementType="position"
                                    swipeThreshold={80}
                                >
                                    {/* NOPE / LIKE overlays */}
                                    <div
                                        className={`swipe-label swipe-label-nope ${swipeHint === 'left' ? 'visible' : ''}`}
                                    >NOPE</div>
                                    <div
                                        className={`swipe-label swipe-label-like ${swipeHint === 'right' ? 'visible' : ''}`}
                                    >LIKE 💜</div>

                                    {/* Avatar area */}
                                    {candidate.profilePictureBase64 ? (
                                        <img
                                            src={candidate.profilePictureBase64}
                                            alt={candidate.name}
                                            className="swipe-card-image"
                                            draggable={false}
                                        />
                                    ) : (
                                        <div
                                            className="swipe-card-avatar-placeholder"
                                            style={{
                                                background: `linear-gradient(135deg, ${generateAvatarColor(candidate.name)}, ${generateAvatarColor2(candidate.name)})`
                                            }}
                                        >
                                            <span className="swipe-card-initials">
                                                {getInitials(candidate.name)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="swipe-card-info">
                                        <div className="swipe-card-name">
                                            {candidate.name}
                                            {getAge(candidate.birthDate) && (
                                                <span className="swipe-card-age">, {getAge(candidate.birthDate)}</span>
                                            )}
                                        </div>
                                        <div className="swipe-card-meta">
                                            {candidate.lookingFor && (
                                                <span className="swipe-card-badge">
                                                    {candidate.lookingFor === 'party_buddies' ? '🎉 Bulizni' :
                                                        candidate.lookingFor === 'friends' ? '👋 Barátok' : '🤝 Mindkettő'}
                                                </span>
                                            )}
                                            {candidate.hasSharedEvent && (
                                                <span className="swipe-card-badge shared">⚡ Közös buli</span>
                                            )}
                                        </div>
                                        {candidate.bio && (
                                            <p className="swipe-card-bio">{candidate.bio}</p>
                                        )}
                                    </div>
                                </TinderCard>
                            </div>

                            <div className="swipe-actions">
                                <button
                                    id="btn-dislike"
                                    className="swipe-btn swipe-btn-dislike"
                                    onClick={() => triggerSwipe('left')}
                                    disabled={swiping}
                                    title="Nem érdekel"
                                >✕</button>

                                <button
                                    id="btn-refresh"
                                    className="swipe-btn swipe-btn-refresh"
                                    onClick={fetchRecommendations}
                                    title="Újratöltés"
                                >↺</button>

                                <button
                                    id="btn-like"
                                    className="swipe-btn swipe-btn-like"
                                    onClick={() => triggerSwipe('right')}
                                    disabled={swiping}
                                    title="Tetszik!"
                                >♥</button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MATCH Overlay */}
            {matchResult && (
                <div className="match-overlay" onClick={() => setMatchResult(null)}>
                    <MatchConfetti />
                    <div className="match-modal" onClick={e => e.stopPropagation()}>
                        <div className="match-ring-container">
                            {matchResult.avatar ? (
                                <img src={matchResult.avatar} alt={matchResult.name} className="buddies-match-avatar" />
                            ) : (
                                <div
                                    className="buddies-match-avatar buddies-match-avatar-placeholder"
                                    style={{
                                        background: `linear-gradient(135deg, ${generateAvatarColor(matchResult.name)}, ${generateAvatarColor2(matchResult.name)})`
                                    }}
                                >
                                    {getInitials(matchResult.name)}
                                </div>
                            )}
                            <div className="match-ring" />
                        </div>

                        <div className="match-hearts">💜</div>
                        <div className="match-title">It's a Match!</div>
                        <p className="match-subtitle">
                            Te és <strong>{matchResult.name}</strong> kölcsönösen szimpatikusak vagytok!
                        </p>
                        <div className="match-modal-actions">
                            <button
                                id="btn-open-chat"
                                className="btn-match-chat"
                                onClick={() => {
                                    setMatchResult(null);
                                    navigate(`/chat/${matchResult.matchId}`);
                                }}
                            >
                                💬 Csevegés megnyitása
                            </button>
                            <button
                                className="btn-match-continue"
                                onClick={() => setMatchResult(null)}
                            >
                                Folytatom a felfedezést
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buddies;
