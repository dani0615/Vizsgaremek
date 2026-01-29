import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const toggleAuth = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
        setSuccessMessage('');
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            if (isLogin) {
                // Bejelentkezés
                const result = await login(email, password);

                if (result.success) {
                    // Sikeres bejelentkezés - átirányítás a főoldalra
                    navigate('/');
                } else {
                    // Hiba esetén megjelenítjük a hibaüzenetet
                    setError(typeof result.error === 'string' ? result.error : 'Hibás email cím vagy jelszó.');
                }
            } else {
                // Regisztráció
                const result = await register(username, email, password);

                if (result.success) {
                    // Sikeres regisztráció
                    setSuccessMessage(typeof result.data === 'string' ? result.data : 'Sikeres regisztráció! Kérjük, erősítse meg az email címét a beérkezett levélben.');
                    // Űrlap mezők törlése
                    setUsername('');
                    setEmail('');
                    setPassword('');
                } else {
                    // Hiba esetén megjelenítjük a hibaüzenetet
                    setError(typeof result.error === 'string' ? result.error : 'Hiba történt a regisztráció során.');
                }
            }
        } catch (err) {
            setError('Hálózati hiba történt. Kérjük, próbálja újra később.');
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="login" className="page active">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 id="auth-title">{isLogin ? "Bejelentkezés" : "Regisztráció"}</h2>

                    {/* Hibaüzenet megjelenítése */}
                    {error && (
                        <div style={{
                            backgroundColor: '#ff4444',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Sikeres üzenet megjelenítése */}
                    {successMessage && (
                        <div style={{
                            backgroundColor: '#00C851',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            textAlign: 'center'
                        }}>
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleAuth}>
                        {!isLogin && (
                            <div id="register-fields">
                                <input
                                    type="text"
                                    placeholder="Felhasználónév"
                                    id="reg-username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        )}
                        <input
                            type="email"
                            placeholder="Email cím"
                            id="auth-email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Jelszó"
                            id="auth-pass"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="btn-pulse"
                            id="auth-btn"
                            disabled={loading}
                        >
                            {loading ? 'Kérem várjon...' : (isLogin ? "Belépés" : "Fiók létrehozása")}
                        </button>
                    </form>
                    <p className="toggle-text" onClick={toggleAuth}>
                        {isLogin ? "Nincs fiókod? Regisztrálj!" : "Már van fiókod? Lépj be!"}
                    </p>
                    <p className="forgot-text" onClick={() => alert('Jelszó emlékeztető elküldve!')}>Elfelejtetted a jelszavad?</p>
                </div>
            </div>
        </section>
    );
};

export default Login;
