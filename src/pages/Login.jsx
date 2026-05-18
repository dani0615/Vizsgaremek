import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassSelect from '../components/GlassSelect';
import GlassDatePicker from '../components/GlassDatePicker';
import '../css/Auth.css';

const GENDER_OPTIONS = [
    { value: 'male', label: 'Férfi' },
    { value: 'female', label: 'Nő' },
    { value: 'other', label: 'Egyéb' },
    { value: 'prefer_not_to_say', label: 'Rejtett' },
];

const LOOKING_FOR_OPTIONS = [
    { value: 'friends', label: 'Barátokat' },
    { value: 'party_buddies', label: 'Bulitársakat' },
    { value: 'both', label: 'Mindenkit!' },
];

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        setShowPassword(false);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!isLogin) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Kérjük, adjon meg egy érvényes email címet!');
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
            if (!passwordRegex.test(password)) {
                setError('A jelszónak legalább 8 karakternek kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot vagy speciális karaktert!');
                return;
            }
        }

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
            {/* Background Decorative Orbs */}
            <div className="auth-background-decor">
                <div className="auth-orb auth-orb--1"></div>
                <div className="auth-orb auth-orb--2"></div>
                <div className="auth-orb auth-orb--3"></div>
            </div>

            <div className="auth-page-wrapper">
                {/* Bal oldal - Miért érdemes? */}
                <div className="auth-features-side">
                    <h2 className="text-gradient">Csatlakozz Közép-Európa<br/>legpörgősebb közösségéhez! 🚀</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
                        Több mint egy eseménykereső. Egy életstílus.
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
                                        <GlassDatePicker
                                            label="Születési dátum"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            maxDate={maxDate}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                        <GlassSelect
                                            label="Nem"
                                            value={gender}
                                            options={GENDER_OPTIONS}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <GlassSelect
                                            label="Kit keresel?"
                                            value={lookingFor}
                                            options={LOOKING_FOR_OPTIONS}
                                            onChange={(e) => setLookingFor(e.target.value)}
                                        />
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
                                <div className="input-with-icon" style={{ position: 'relative' }}>
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
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
                                <p className="forgot-text" onClick={() => navigate('/forgot-password')}>
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
