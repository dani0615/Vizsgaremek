import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { apiClient, API_BASE_URL } from '../services/apiConfig';
import { useAuth } from '../context/AuthContext';
import '../css/Messages.css';

const Chat = () => {
    const { matchId } = useParams();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const shouldAutoScroll = useRef(true);

    const scrollToBottom = (smooth = true) => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({ top: container.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    };

    const handleScroll = (e) => {
        const element = e.target;
        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
        shouldAutoScroll.current = isNearBottom;
    };

    useEffect(() => {
        // Only auto-scroll if user is already at the bottom
        if (shouldAutoScroll.current) {
            scrollToBottom(false);
        }
    }, [messages]);

    // Fetch initial history and partner info
    const initChat = useCallback(async () => {
        if (matchId === 'new') {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Get partner info from matches list (or a specific endpoint if we had one)
            const matchesRes = await apiClient.get('/Matching/Matches');
            const currentMatch = matchesRes.data.find(m => m.matchID === parseInt(matchId));
            
            if (!currentMatch) {
                navigate('/messages');
                return;
            }

            setPartner(currentMatch.partner);
            setChatRoomId(currentMatch.chatRoomID);

            // Get history
            const historyRes = await apiClient.get(`/Chat/History/${matchId}`);
            setMessages(historyRes.data);
            
        } catch (err) {
            console.error('Hiba a chat inicializálásakor:', err);
        } finally {
            setLoading(false);
        }
    }, [matchId, navigate]);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        initChat();
    }, [isAuthenticated, authLoading, initChat, navigate]);

    // SignalR Connection
    useEffect(() => {
        if (!chatRoomId) return;

        const token = localStorage.getItem('token');
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/chathub?access_token=${token}`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [chatRoomId]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    setIsConnected(true);
                    console.log('SignalR csatlakozva');
                    
                    connection.on('ReceiveMessage', (msg) => {
                        // msg format: { messageId, chatRoomId, sender: { userID, username, name }, message, sentAt }
                        if (msg.chatRoomId === chatRoomId) {
                            setMessages(prev => [...prev, msg]);
                        }
                    });

                    connection.on('Error', (err) => {
                        console.error('SignalR szerver hiba:', err);
                    });
                })
                .catch(err => {
                    console.error('SignalR hiba:', err);
                    setIsConnected(false);
                });
        }
    }, [connection, chatRoomId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !isConnected || !connection) return;

        try {
            // Send via SignalR
            await connection.invoke('SendMessage', chatRoomId, newMessage.trim());
            setNewMessage('');
        } catch (err) {
            console.error('Üzenetküldési hiba:', err);
        }
    };

    const handleSearch = async (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (!q.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            setIsSearching(true);
            const res = await apiClient.get(`/api/User/search?q=${encodeURIComponent(q)}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error('Keresési hiba:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const initiateChat = async (targetUserId) => {
        try {
            setLoading(true);
            const res = await apiClient.post(`/Chat/Initiate/${targetUserId}`);
            if (res.data.matchId) {
                navigate(`/chat/${res.data.matchId}`, { replace: true });
            }
        } catch (err) {
            console.error('Hiba a beszélgetés indításakor:', err);
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    if (matchId === 'new') {
        return (
            <div className="chat-page page">
                <div className="chat-header">
                    <button className="chat-back-btn" onClick={() => navigate('/messages')}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className="chat-header-info">
                        <div className="chat-partner-name">Új beszélgetés indítása</div>
                    </div>
                </div>

                <div className="new-chat-container">
                    <div className="search-input-container">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            className="user-search-input" 
                            placeholder="Keresés név alapján..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            autoFocus
                        />
                    </div>
                    {isSearching ? (
                        <div className="buddies-loading" style={{marginTop: '2rem'}}>
                            <div className="spinner" />
                        </div>
                    ) : (
                        <div className="search-results">
                            {searchResults.map(u => (
                                <div 
                                    key={u.userID} 
                                    className="search-result-item" 
                                    onClick={() => initiateChat(u.userID)}
                                >
                                    {u.profilePictureBase64 ? (
                                        <img src={u.profilePictureBase64} alt={u.name} className="chat-header-avatar" />
                                    ) : (
                                        <div className="chat-header-avatar-placeholder">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="match-info">
                                        <div className="search-result-name">{u.name}</div>
                                        <div className="search-result-username">@{u.username}</div>
                                    </div>
                                </div>
                            ))}
                            {searchQuery.trim() && searchResults.length === 0 && !isSearching && (
                                <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem'}}>
                                    Nincs találat.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="chat-page page">
            <div className="chat-header">
                <button className="chat-back-btn" onClick={() => navigate('/messages')}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                
                {partner?.profilePictureBase64 ? (
                    <img src={partner.profilePictureBase64} alt={partner.name} className="chat-header-avatar" />
                ) : (
                    <div className="chat-header-avatar-placeholder">
                        {partner?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                
                <div className="chat-header-info">
                    <div className="chat-partner-name">{partner?.name}</div>
                    <div className="chat-status">
                        <span className={`chat-status-dot ${isConnected ? 'online' : 'offline'}`}></span>
                        {isConnected ? 'Kapcsolódva' : 'Újracsatlakozás...'}
                    </div>
                </div>
            </div>

            <div className="chat-messages" ref={messagesContainerRef} onScroll={handleScroll}>
                {loading ? (
                    <div className="buddies-loading">
                        <div className="spinner" />
                        <span>Üzenetek betöltése...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty-messages">
                        <span>👋</span>
                        <p>Kezdj el beszélgetni {partner?.name} felhasználóval!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isOwn = msg.sender.userID === user?.userId;
                        const senderAvatar = isOwn ? user?.profilePictureBase64 : partner?.profilePictureBase64;
                        const senderName = isOwn ? user?.name : partner?.name;
                        return (
                            <div key={msg.messageID || idx} className={`chat-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
                                {!isOwn && (
                                    senderAvatar ? (
                                        <img src={senderAvatar} alt={senderName} className="chat-bubble-avatar" />
                                    ) : (
                                        <div className="chat-bubble-avatar-placeholder">
                                            {senderName?.charAt(0).toUpperCase()}
                                        </div>
                                    )
                                )}
                                <div className={`chat-bubble ${isOwn ? 'own' : 'other'}`}>
                                    <div className="chat-text">{msg.message}</div>
                                    <div className="chat-bubble-time">
                                        {new Date(msg.sentAt).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Írj egy üzenetet..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                />
                <button type="submit" className="chat-send-btn" disabled={!newMessage.trim() || !isConnected}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
};

export default Chat;
