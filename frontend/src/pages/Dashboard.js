import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/api';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (err) {
            setError('Erreur de chargement des utilisateurs');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (err) {
            setError('Erreur lors de la suppression');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🛡️ DevSecOps Dashboard</h2>
                <div style={styles.headerRight}>
                    <span style={styles.welcome}>👤 {username}</span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.tableContainer}>
                <h3 style={styles.subtitle}>👥 Liste des utilisateurs</h3>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Username</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={styles.tr}>
                            <td style={styles.td}>{user.id}</td>
                            <td style={styles.td}>{user.username}</td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>
                  <span style={user.role === 'ADMIN' ? styles.badgeAdmin : styles.badgeUser}>
                    {user.role}
                  </span>
                            </td>
                            <td style={styles.td}>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    title: { color: '#38bdf8', margin: 0 },
    subtitle: { color: '#94a3b8', marginBottom: '16px' },
    welcome: { color: '#94a3b8' },
    logoutBtn: { padding: '8px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    tableContainer: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#38bdf8', padding: '12px', textAlign: 'left', borderBottom: '1px solid #334155' },
    tr: { borderBottom: '1px solid #1e293b' },
    td: { color: '#e2e8f0', padding: '12px' },
    badgeAdmin: { backgroundColor: '#7c3aed', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
    badgeUser: { backgroundColor: '#0369a1', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
    deleteBtn: { padding: '6px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    error: { color: '#f87171', textAlign: 'center' }
};

export default Dashboard;