import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5115'}/api/PasswordReset/Forgot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'A jelszó visszaállítási linket elküldtük.');
            } else {
                setError(data.message || 'Hiba történt a kérés során.');
            }
        } catch (err) {
            setError('Hálózati hiba történt. Kérjük, próbálja újra később.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="forgot-password" className="page active">
            <div className="auth-page-wrapper" style={{ justifyContent: 'center' }}>
                <div className="auth-form-side" style={{ maxWidth: '500px' }}>
                    <div className="auth-box">
                        <Link to="/login" className="back-link" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                            <i className="fas fa-arrow-left"></i> Vissza a bejelentkezéshez
                        </Link>
                        
                        <h2 className="text-gradient">Elfelejtett jelszó</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>
                            Add meg az email címedet, és küldünk egy linket, amivel új jelszót állíthatsz be.
                        </p>

                        {error && (
                            <div className="alert alert-error" style={{ backgroundColor: 'rgba(255, 68, 68, 0.2)', border: '1px solid #ff4444', color: 'white', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                                <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="alert alert-success" style={{ backgroundColor: 'rgba(0, 200, 81, 0.2)', border: '1px solid #00C851', color: 'white', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <label>Email cím</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-envelope"></i>
                                    <input
                                        type="email"
                                        placeholder="email@pelda.hu"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-auth"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span><i className="fas fa-spinner fa-spin"></i> Folyamatban...</span>
                                ) : (
                                    "Link küldése"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
