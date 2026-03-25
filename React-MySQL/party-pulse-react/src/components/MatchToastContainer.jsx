import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchNotifications } from '../context/MatchNotificationContext';
import '../css/MatchToast.css';

const TOAST_DURATION = 5000; // ms before auto-dismiss

const SingleToast = ({ toast, onDismiss }) => {
    const navigate = useNavigate();
    const [exiting, setExiting] = useState(false);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(toast.toastId), 400);
    };

    useEffect(() => {
        const timer = setTimeout(handleDismiss, TOAST_DURATION);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenChat = () => {
        handleDismiss();
        navigate(`/chat/${toast.matchID}`);
    };

    const initial = toast.partner?.name?.charAt(0)?.toUpperCase() ?? '?';

    return (
        <div className={`match-toast ${exiting ? 'match-toast--exit' : ''}`}>
            <div className="match-toast__glow" />
            <button className="match-toast__close" onClick={handleDismiss}>✕</button>

            <div className="match-toast__header">
                <span className="match-toast__fire">💜</span>
                <span className="match-toast__title">Új Match!</span>
            </div>

            <div className="match-toast__body">
                {toast.partner?.profilePictureBase64 ? (
                    <img
                        src={toast.partner.profilePictureBase64}
                        alt={toast.partner.name}
                        className="match-toast__avatar"
                    />
                ) : (
                    <div className="match-toast__avatar match-toast__avatar--placeholder">
                        {initial}
                    </div>
                )}
                <div className="match-toast__info">
                    <p className="match-toast__name">{toast.partner?.name}</p>
                    <p className="match-toast__sub">Kölcsönösen szimpatikusak vagytok! 🎉</p>
                </div>
            </div>

            <div className="match-toast__actions">
                <button className="match-toast__btn match-toast__btn--chat" onClick={handleOpenChat}>
                    💬 Üzenet küldése
                </button>
                <button className="match-toast__btn match-toast__btn--dismiss" onClick={handleDismiss}>
                    Később
                </button>
            </div>

            <div className="match-toast__progress" style={{ animationDuration: `${TOAST_DURATION}ms` }} />
        </div>
    );
};

const MatchToastContainer = () => {
    const { toastQueue, dismissToast } = useMatchNotifications();

    return (
        <div className="match-toast-container">
            {toastQueue.map(toast => (
                <SingleToast key={toast.toastId} toast={toast} onDismiss={dismissToast} />
            ))}
        </div>
    );
};

export default MatchToastContainer;
