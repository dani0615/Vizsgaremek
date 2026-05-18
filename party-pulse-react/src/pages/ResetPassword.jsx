import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../css/Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Token és email kinyerése az URL-ből
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError('Érvénytelen vagy hiányzó jelszó visszaállítási link.');
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('A két jelszó nem egyezik meg!');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('A jelszónak legalább 8 karakternek kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot vagy speciális karaktert!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5115'}/api/PasswordReset/Reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'A jelszó sikeresen megváltoztatva!');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'Hiba történt a jelszó visszaállítása során.');
            }
        } catch (err) {
            setError('Hálózati hiba történt. Kérjük, próbálja újra később.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="reset-password" className="page active">
            <div className="auth-page-wrapper" style={{ justifyContent: 'center' }}>
                <div className="auth-form-side" style={{ maxWidth: '500px' }}>
                    <div className="auth-box">
                        <h2 className="text-gradient">Új jelszó beállítása</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>
                            Add meg az új jelszavadat alább.
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
                                <label>Új jelszó</label>
                                <div className="input-with-icon" style={{ position: 'relative' }}>
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading || !token}
                                        style={{ paddingRight: '45px' }}
                                    />
                                    <i 
                                        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ 
                                            position: 'absolute', 
                                            right: '15px',
                                            left: 'auto',
                                            top: '50%', 
                                            transform: 'translateY(-50%)', 
                                            cursor: 'pointer',
                                            color: 'rgba(255, 255, 255, 0.6)'
                                        }}
                                    ></i>
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label>Jelszó megerősítése</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading || !token}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-auth"
                                disabled={loading || !token}
                            >
                                {loading ? (
                                    <span><i className="fas fa-spinner fa-spin"></i> Folyamatban...</span>
                                ) : (
                                    "Jelszó megváltoztatása"
                                )}
                            </button>
                        </form>
                        
                        <div className="auth-footer" style={{ marginTop: '20px' }}>
                            <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                                Mégis tudom a jelszavam, <strong>bejelentkezek</strong>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
