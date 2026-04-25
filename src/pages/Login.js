import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(credentials);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/dashboard');
        } catch (err) {
            setError('Username ou mot de passe incorrect');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🔐 DevSecOps Login</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    style={styles.input}
                    placeholder="Username"
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
                <button style={styles.button} onClick={handleSubmit}>
                    Se connecter
                </button>
                <p style={styles.link}>
                    Pas de compte ? <Link to="/register">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' },
    card: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', width: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
    title: { color: '#38bdf8', textAlign: 'center', marginBottom: '24px' },
    input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    error: { color: '#f87171', textAlign: 'center' },
    link: { color: '#94a3b8', textAlign: 'center', marginTop: '16px' }
};

export default Login;