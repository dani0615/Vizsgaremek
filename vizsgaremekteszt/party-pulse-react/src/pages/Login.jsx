import React, { useState } from 'react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toggleAuth = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const handleAuth = (e) => {
        e.preventDefault();
        const action = isLogin ? "Belépve!" : "Sikeres regisztráció!";
        alert(action);
        //navigate('/'); // Később ide jön az API hívás és átirányítás
    };

    return (
        <section id="login" className="page active">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 id="auth-title">{isLogin ? "Bejelentkezés" : "Regisztráció"}</h2>
                    <form onSubmit={handleAuth}>
                        {!isLogin && (
                            <div id="register-fields">
                                <input
                                    type="text"
                                    placeholder="Felhasználónév"
                                    id="reg-username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                        />
                        <input
                            type="password"
                            placeholder="Jelszó"
                            id="auth-pass"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="btn-pulse" id="auth-btn">
                            {isLogin ? "Belépés" : "Fiók létrehozása"}
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