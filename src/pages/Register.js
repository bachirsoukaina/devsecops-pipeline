import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
    const [user, setUser] = useState({ username: '', password: '', email: '', role: 'USER' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(user);
            setSuccess('Compte créé avec succès !');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Erreur lors de la création du compte');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>📝 Créer un compte</h2>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                <input
                    style={styles.input}
                    placeholder="Username"
                    onChange={(e) => setUser({...user, username: e.target.value})}
                />
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUser({...user, password: e.target.value})}
                />
                <input
                    style={styles.input}
                    placeholder="Email"
                    onChange={(e) => setUser({...user, email: e.target.value})}
                />
                <button style={styles.button} onClick={handleSubmit}>
                    S'inscrire
                </button>
                <p style={styles.link}>
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
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
    success: { color: '#4ade80', textAlign: 'center' },
    link: { color: '#94a3b8', textAlign: 'center', marginTop: '16px' }
};

export default Register;