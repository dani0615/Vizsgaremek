import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Auth.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Új mezők a regisztrációhoz
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState('prefer_not_to_say');
    const [birthDate, setBirthDate] = useState('');
    const [lookingFor, setLookingFor] = useState('both');

    // Életkor korlátozás: minimum 16 év
    const today = new Date();
    const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const maxDate = sixteenYearsAgo.toISOString().split('T')[0];

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const toggleAuth = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
        setSuccessMessage('');
        setDisplayName('');
        setGender('prefer_not_to_say');
        setBirthDate('');
        setLookingFor('both');
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
                    setError(typeof result.error === 'string' ? result.error : 'Hibás felhasználónév/email vagy jelszó.');
                }
            } else {
                // Regisztráció
                const result = await register(username, email, password, gender, birthDate, lookingFor, displayName);

                if (result.success) {
                    // Sikeres regisztráció
                    setSuccessMessage(typeof result.data === 'string' ? result.data : 'Sikeres regisztráció! Kérjük, erősítse meg az email címét a beérkezett levélben.');
                    // Űrlap mezők törlése
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                    setGender('prefer_not_to_say');
                    setBirthDate('');
                    setLookingFor('both');
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
            <div className="auth-page-wrapper">
                {/* Bal oldal - Miért érdemes? */}
                <div className="auth-features-side">
                    <h2 className="text-gradient">Party Pulse Life</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
                        Csatlakozz Közép-Európa legpörgősebb közösségéhez! 🚀
                    </p>

                    <div className="features-list">
                        <div className="feature-item">
                            <div className="feature-icon">🔥</div>
                            <div className="feature-text">
                                <h4>Exkluzív Események</h4>
                                <p>Férj hozzá titkos underground bulikhoz és VIP eseményekhez, amikről mások nem is tudnak.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">👥</div>
                            <div className="feature-text">
                                <h4>Party Buddy Match</h4>
                                <p>Ne menj egyedül! Találj magad mellé hasonló zenei ízlésű embereket az intelligens keresőnkkel.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">🏆</div>
                            <div className="feature-text">
                                <h4>Pontok & Ranglista</h4>
                                <p>Gyűjts pontokat a részvételeiddel, szerezz egyedi jelvényeket és legyél te a város éjszakai királya!</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">💬</div>
                            <div className="feature-text">
                                <h4>Közösségi Élmény</h4>
                                <p>Chatelj a többi résztvevővel valós időben, oszd meg az élményeidet és nézd meg a többiek értékeléseit.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobb oldal - Form */}
                <div className="auth-form-side">
                    <div className="auth-box">
                        <h2>{isLogin ? "Üdv újra!" : "Kezdjük el!"}</h2>

                        {error && (
                            <div style={{
                                backgroundColor: 'rgba(255, 68, 68, 0.2)',
                                border: '1px solid #ff4444',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                fontSize: '0.9rem'
                            }}>
                                <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div style={{
                                backgroundColor: 'rgba(0, 200, 81, 0.2)',
                                border: '1px solid #00C851',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                fontSize: '0.9rem'
                            }}>
                                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleAuth}>
                            {!isLogin && (
                                <div className="register-animation-wrapper">
                                    <div className="auth-input-group">
                                        <label>Felhasználónév</label>
                                        <div className="input-with-icon">
                                            <i className="fas fa-at"></i>
                                            <input
                                                type="text"
                                                placeholder="pl. party_animal"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="auth-input-group">
                                        <label>Megjelenítendő név</label>
                                        <div className="input-with-icon">
                                            <i className="fas fa-user"></i>
                                            <input
                                                type="text"
                                                placeholder="Hogy hívjunk?"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="auth-input-group">
                                        <label>Születési dátum</label>
                                        <div className="input-with-icon">
                                            <i className="fas fa-calendar"></i>
                                            <input
                                                type="date"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                                max={maxDate}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div className="auth-input-group" style={{ flex: 1 }}>
                                            <label>Nem</label>
                                            <div className="input-with-icon">
                                                <i className="fas fa-venus-mars"></i>
                                                <select
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                    disabled={loading}
                                                >
                                                    <option value="male">Férfi</option>
                                                    <option value="female">Nő</option>
                                                    <option value="other">Egyéb</option>
                                                    <option value="prefer_not_to_say">Rejtett</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="auth-input-group" style={{ flex: 1 }}>
                                            <label>Kit keresel?</label>
                                            <div className="input-with-icon">
                                                <i className="fas fa-search-heart"></i>
                                                <select
                                                    value={lookingFor}
                                                    onChange={(e) => setLookingFor(e.target.value)}
                                                    disabled={loading}
                                                >
                                                    <option value="friends">Barátokat</option>
                                                    <option value="party_buddies">Bulitársakat</option>
                                                    <option value="both">Mindenkit!</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="auth-input-group">
                                <label>{isLogin ? "Azonosító" : "Email cím"}</label>
                                <div className="input-with-icon">
                                    <i className={isLogin ? "fas fa-user-shield" : "fas fa-envelope"}></i>
                                    <input
                                        type={isLogin ? "text" : "email"}
                                        placeholder={isLogin ? "Név vagy Email" : "email@pelda.hu"}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label>Jelszó</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    isLogin ? "Bejelentkezés" : "Regisztráció"
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p className="toggle-text" onClick={toggleAuth}>
                                {isLogin ? (
                                    <>Nincs még fiókod? <strong>Regisztrálj!</strong></>
                                ) : (
                                    <>Már tag vagy? <strong>Belépés</strong></>
                                )}
                            </p>
                            {isLogin && (
                                <p className="forgot-text" onClick={() => alert('Jelszó emlékeztető elküldve!')}>
                                    Elfelejtetted a jelszavad?
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
