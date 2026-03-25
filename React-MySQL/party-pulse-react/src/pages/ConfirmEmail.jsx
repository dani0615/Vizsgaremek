import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiConfig';
import '../css/Auth.css'; // Használjuk az Auth stílusokat

const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Megerősítés folyamatban...');

    useEffect(() => {
        const felhasznalonev = searchParams.get('felhasznalonev');
        const email = searchParams.get('email');

        if (!felhasznalonev || !email) {
            setStatus('error');
            setMessage('Érvénytelen megerősítő link (hiányzó paraméterek).');
            return;
        }

        const confirmRegistry = async () => {
            try {
                // A megfelelő GET végpont hívása
                const response = await apiClient.get(`/api/Registry?felhasznalonev=${encodeURIComponent(felhasznalonev)}&email=${encodeURIComponent(email)}`);
                
                setStatus('success');
                setMessage(typeof response.data === 'string' ? response.data : "Sikeres regisztráció megerősítés. Most már bejelentkezhet!");
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data && typeof err.response.data === 'string' ? err.response.data : 'Hiba történt a megerősítés során.');
            }
        };

        confirmRegistry();
    }, [searchParams]);

    return (
        <section className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
            <div className="auth-box" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>Regisztráció Megerősítése</h2>
                
                {status === 'loading' && (
                    <div>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#ff4444', marginBottom: '20px' }}></i>
                        <p>{message}</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div>
                        <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#00C851', marginBottom: '20px' }}></i>
                        <p style={{ color: '#00C851', marginBottom: '20px' }}>{message}</p>
                        <button className="btn-auth" onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
                            Tovább a bejelentkezéshez
                        </button>
                    </div>
                )}
                
                {status === 'error' && (
                    <div>
                        <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#ff4444', marginBottom: '20px' }}></i>
                        <p style={{ color: '#ff4444', marginBottom: '20px' }}>{message}</p>
                        <button className="btn-auth" onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
                            Vissza a bejelentkezéshez
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ConfirmEmail;
