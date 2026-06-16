import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/api';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('books');
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';

  // Données fictives pour les livres/formations
  const featuredBooks = [
    { id: 1, title: 'The Art of Hacking', author: 'David Kennedy', rating: 4.8, price: '49.99', image: '📖', category: 'Pentesting' },
    { id: 2, title: 'Cloud Security Essentials', author: 'Sarah Johnson', rating: 4.9, price: '59.99', image: '☁️', category: 'Cloud' },
    { id: 3, title: 'DevSecOps Handbook', author: 'John Willis', rating: 4.7, price: '39.99', image: '📘', category: 'DevSecOps' },
    { id: 4, title: 'Zero Trust Architecture', author: 'Chase Cunningham', rating: 4.9, price: '69.99', image: '🔐', category: 'Architecture' },
    { id: 5, title: 'Web Security 101', author: 'Michael Smith', rating: 4.6, price: '34.99', image: '🌐', category: 'Web' },
    { id: 6, title: 'AI & Cybersecurity', author: 'Emily Chen', rating: 4.9, price: '79.99', image: '🤖', category: 'AI' },
  ];

  const featuredCourses = [
    { id: 1, title: 'Certified Ethical Hacker', provider: 'EC-Council', students: 15234, rating: 4.8, price: '299', image: '🎯' },
    { id: 2, title: 'AWS Security Specialization', provider: 'Cloud Academy', students: 8765, rating: 4.7, price: '249', image: '☁️' },
    { id: 3, title: 'Kubernetes Security', provider: 'Linux Foundation', students: 5432, rating: 4.9, price: '199', image: '🐳' },
    { id: 4, title: 'Zero Trust Implementation', provider: 'Palo Alto', students: 3210, rating: 4.6, price: '349', image: '🛡️' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (isAdmin) {
      fetchUsers();
    }
  }, [navigate, isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError('Impossible de charger la liste des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.')) return;
    setDeleteLoading(id);
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError('Erreur lors de la suppression');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Books Tab Content
  const BooksTab = () => (
    <div className="tab-content fade-in">
      <div className="section-header">
        <div>
          <h2>📚 Livres populaires</h2>
          <p className="section-subtitle">Les meilleurs livres de cybersécurité sélectionnés par nos experts</p>
        </div>
        <span className="section-count">{featuredBooks.length} livres</span>
      </div>
      <div className="books-grid">
        {featuredBooks.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-image">{book.image}</div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <div className="book-meta">
                <span className="book-category">{book.category}</span>
                <span className="book-rating">⭐ {book.rating}</span>
              </div>
              <div className="book-footer">
                <span className="book-price">${book.price}</span>
                <button className="btn-primary btn-sm">📥 Réserver</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Courses Tab Content
  const CoursesTab = () => (
    <div className="tab-content fade-in">
      <div className="section-header">
        <div>
          <h2>🎓 Formations certifiantes</h2>
          <p className="section-subtitle">Des formations de qualité pour booster votre carrière</p>
        </div>
        <span className="section-count">{featuredCourses.length} formations</span>
      </div>
      <div className="courses-grid">
        {featuredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <span className="course-icon">{course.image}</span>
              <span className="course-badge">🎓 Certifié</span>
            </div>
            <h3>{course.title}</h3>
            <p className="course-provider">par {course.provider}</p>
            <div className="course-stats">
              <span>👥 {course.students.toLocaleString()} étudiants</span>
              <span>⭐ {course.rating}</span>
            </div>
            <div className="course-footer">
              <span className="course-price">${course.price}</span>
              <button className="btn-primary btn-sm">🎯 S'inscrire</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Users Tab Content (Admin Only)
  const UsersTab = () => (
    <div className="tab-content fade-in">
      <div className="section-header">
        <div>
          <h2>👥 Gestion des utilisateurs</h2>
          <p className="section-subtitle">Gérez les membres de votre plateforme</p>
        </div>
        <div className="section-actions">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary btn-sm" disabled>
            ➕ Ajouter
          </button>
        </div>
      </div>

      {error && (
        <div className="dashboard-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="table-wrapper">
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Chargement des utilisateurs...</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur enregistré'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="cell-id">#{user.id}</td>
                    <td>
                      <div className="user-cell">
                        <span className="user-avatar-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                        <span className="user-cell-name">{user.username}</span>
                        {user.username === 'admin' && (
                          <span className="user-badge">👑</span>
                        )}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                        {user.role === 'ADMIN' ? '👑 Admin' : '👤 Membre'}
                      </span>
                    </td>
                    <td className="text-center">
                      {user.username !== 'admin' ? (
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteLoading === user.id}
                        >
                          {deleteLoading === user.id ? (
                            <span className="spinner-small"></span>
                          ) : (
                            '🗑️ Supprimer'
                          )}
                        </button>
                      ) : (
                        <span className="protected-badge">🔒 Protégé</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Utilisateurs totaux</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👑</span>
          <div>
            <span className="stat-number">{users.filter(u => u.role === 'ADMIN').length}</span>
            <span className="stat-label">Administrateurs</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👤</span>
          <div>
            <span className="stat-number">{users.filter(u => u.role !== 'ADMIN').length}</span>
            <span className="stat-label">Membres</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="dashboard-nav glass">
        <div className="nav-left">
          <span className="nav-logo">🛡️ Secur<span>Learn</span></span>
          <div className="nav-links">
            <button 
              className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              📚 Bibliothèque
            </button>
            <button 
              className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              🎓 Formations
            </button>
            {isAdmin && (
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Utilisateurs
              </button>
            )}
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <span className="user-avatar">{username?.charAt(0).toUpperCase()}</span>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className={`user-role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
                {isAdmin ? '👑 Admin' : '👤 Membre'}
              </span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* HERO BANNER */}
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🔥</span> Nouveautés cyber 2026
            </div>
            <h1>Bienvenue, <span className="highlight">{username}</span> 👋</h1>
            <p>
              {isAdmin 
                ? 'Vous avez accès à la gestion complète de la plateforme'
                : 'Découvrez notre bibliothèque de livres et formations en cybersécurité'
              }
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setActiveTab('books')}>
                <span>Explorer la bibliothèque</span>
                <span>→</span>
              </button>
              {isAdmin && (
                <button className="btn-secondary" onClick={() => setActiveTab('users')}>
                  <span>Gérer les utilisateurs</span>
                </button>
              )}
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">500+</span>
              <span className="hero-stat-label">Livres</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">200+</span>
              <span className="hero-stat-label">Formations</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">50K+</span>
              <span className="hero-stat-label">Apprenants</span>
            </div>
            {isAdmin && (
              <div className="hero-stat">
                <span className="hero-stat-number">{users.length}</span>
                <span className="hero-stat-label">Utilisateurs</span>
              </div>
            )}
          </div>
        </div>

        {/* TABS CONTENT */}
        <div className="tabs-container">
          {activeTab === 'books' && <BooksTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'users' && isAdmin && <UsersTab />}
        </div>
      </main>

      <style>{`
        /* ===== DASHBOARD STYLES ===== */
        .dashboard-container {
          min-height: 100vh;
          background: #f0f5f2;
          display: flex;
          flex-direction: column;
        }

        /* NAVBAR */
        .dashboard-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 40px;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(226, 231, 228, 0.5);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-logo {
          font-size: 20px;
          font-weight: 800;
          color: var(--gray-900);
          letter-spacing: -0.02em;
        }

        .nav-logo span {
          color: var(--primary);
        }

        .nav-links {
          display: flex;
          gap: 8px;
        }

        .nav-link {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: var(--gray-500);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          border-radius: var(--radius-sm);
          font-family: inherit;
          position: relative;
        }

        .nav-link:hover {
          color: var(--gray-800);
          background: var(--gray-100);
        }

        .nav-link.active {
          color: var(--primary);
          background: var(--primary-soft);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 12px 4px 4px;
          background: var(--off-white);
          border-radius: var(--radius-full);
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--gray-800);
        }

        .user-role-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 1px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: inline-block;
          width: fit-content;
        }

        .user-role-badge.role-admin {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .user-role-badge.role-user {
          background: var(--gray-200);
          color: var(--gray-500);
        }

        .btn-logout {
          padding: 8px 20px;
          background: transparent;
          color: var(--gray-500);
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          font-family: inherit;
        }

        .btn-logout:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #dc2626;
        }

        /* MAIN */
        .dashboard-main {
          flex: 1;
          padding: 32px 40px 48px;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
        }

        /* HERO BANNER */
        .hero-banner {
          background: var(--primary-gradient);
          border-radius: var(--radius-xl);
          padding: 40px 48px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.2;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px 4px 10px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 12px;
        }

        .hero-content h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .hero-content .highlight {
          color: #7ddfa0;
        }

        .hero-content p {
          font-size: 15px;
          opacity: 0.85;
          margin-bottom: 20px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-actions .btn-primary {
          background: white;
          color: var(--primary);
        }

        .hero-actions .btn-primary:hover {
          background: rgba(255, 255, 255, 0.9);
          color: var(--primary-dark);
        }

        .hero-actions .btn-secondary {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .hero-actions .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .hero-stats {
          display: flex;
          gap: 32px;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .hero-stat-number {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .hero-stat-label {
          font-size: 12px;
          opacity: 0.7;
        }

        /* TABS */
        .tabs-container {
          margin-top: 8px;
        }

        .tab-content {
          animation: fadeIn 0.4s ease;
        }

        /* SECTIONS */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-header h2 {
          font-size: 22px;
          color: var(--gray-900);
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          color: var(--gray-500);
          font-size: 14px;
        }

        .section-count {
          font-size: 13px;
          color: var(--gray-400);
          background: var(--gray-100);
          padding: 4px 14px;
          border-radius: var(--radius-full);
        }

        .section-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          opacity: 0.5;
        }

        .search-input {
          padding: 8px 14px 8px 36px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-sm);
          font-size: 14px;
          background: var(--white);
          outline: none;
          transition: var(--transition);
          font-family: inherit;
          min-width: 200px;
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .btn-sm {
          padding: 8px 18px;
          font-size: 13px;
          min-height: 38px;
        }

        /* BOOKS GRID */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .book-card {
          background: white;
          border-radius: var(--radius-md);
          padding: 18px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-bounce);
          border: 1px solid rgba(226, 231, 228, 0.5);
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .book-image {
          font-size: 40px;
          text-align: center;
          margin-bottom: 10px;
        }

        .book-info h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 2px;
        }

        .book-author {
          font-size: 12px;
          color: var(--gray-500);
          margin-bottom: 6px;
        }

        .book-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 11px;
        }

        .book-category {
          padding: 2px 10px;
          background: var(--primary-soft);
          color: var(--primary);
          border-radius: var(--radius-full);
          font-weight: 500;
        }

        .book-rating {
          color: var(--gray-600);
        }

        .book-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .book-price {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary);
        }

        /* COURSES GRID */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        .course-card {
          background: white;
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-bounce);
          border: 1px solid rgba(226, 231, 228, 0.5);
        }

        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .course-icon {
          font-size: 28px;
        }

        .course-badge {
          padding: 2px 12px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 600;
        }

        .course-card h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 2px;
        }

        .course-provider {
          font-size: 12px;
          color: var(--gray-500);
          margin-bottom: 6px;
        }

        .course-stats {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--gray-500);
          margin-bottom: 10px;
        }

        .course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid var(--gray-100);
        }

        .course-price {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary);
        }

        /* TABLE */
        .table-wrapper {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          border: 1px solid rgba(226, 231, 228, 0.5);
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .user-table thead {
          background: var(--off-white);
        }

        .user-table th {
          padding: 12px 18px;
          text-align: left;
          font-weight: 600;
          color: var(--gray-500);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--gray-200);
        }

        .user-table td {
          padding: 12px 18px;
          border-bottom: 1px solid var(--gray-100);
          color: var(--gray-800);
          vertical-align: middle;
        }

        .user-table tbody tr:hover {
          background: var(--off-white);
        }

        .user-table tbody tr:last-child td {
          border-bottom: none;
        }

        .cell-id {
          color: var(--gray-400);
          font-weight: 500;
          font-size: 12px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar-sm {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--primary-soft);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 12px;
          flex-shrink: 0;
        }

        .user-cell-name {
          font-weight: 500;
        }

        .user-badge {
          font-size: 14px;
        }

        .role-badge {
          padding: 3px 12px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
        }

        .role-badge.role-admin {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .role-badge.role-user {
          background: var(--gray-100);
          color: var(--gray-500);
        }

        .protected-badge {
          font-size: 11px;
          color: var(--gray-400);
          background: var(--gray-100);
          padding: 3px 12px;
          border-radius: var(--radius-full);
        }

        .text-center {
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: 32px 20px;
          color: var(--gray-400);
          font-size: 14px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          gap: 12px;
        }

        .loader {
          width: 28px;
          height: 28px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-state p {
          color: var(--gray-500);
          font-size: 13px;
        }

        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(220, 38, 38, 0.2);
          border-top-color: #dc2626;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        .dashboard-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          border-left: 4px solid #dc2626;
        }

        /* ADMIN STATS */
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .stat-card {
          background: white;
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(226, 231, 228, 0.5);
        }

        .stat-icon {
          font-size: 28px;
        }

        .stat-card div {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: var(--gray-900);
        }

        .stat-label {
          font-size: 12px;
          color: var(--gray-500);
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .dashboard-nav {
            padding: 12px 24px;
          }
          .hero-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            padding: 28px 24px;
          }
          .hero-stats {
            width: 100%;
            justify-content: space-around;
          }
          .dashboard-main {
            padding: 24px 20px 32px;
          }
          .admin-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-nav {
            padding: 10px 16px;
            flex-wrap: wrap;
            gap: 8px;
          }
          .nav-left {
            gap: 16px;
          }
          .nav-links {
            gap: 4px;
          }
          .nav-link {
            font-size: 12px;
            padding: 6px 12px;
          }
          .nav-right {
            flex-wrap: wrap;
            gap: 8px;
          }
          .nav-user .user-info {
            display: none;
          }
          .btn-logout {
            padding: 6px 14px;
            font-size: 12px;
          }
          .hero-banner {
            padding: 20px 16px;
            border-radius: var(--radius-lg);
          }
          .hero-content h1 {
            font-size: 24px;
          }
          .hero-stats {
            gap: 16px;
          }
          .hero-stat-number {
            font-size: 20px;
          }
          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          .courses-grid {
            grid-template-columns: 1fr 1fr;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .section-actions {
            width: 100%;
          }
          .search-input {
            min-width: 120px;
          }
          .user-table th,
          .user-table td {
            padding: 8px 12px;
            font-size: 12px;
          }
          .user-table .cell-id {
            display: none;
          }
          .user-table th:first-child {
            display: none;
          }
          .admin-stats {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .dashboard-nav {
            padding: 8px 12px;
          }
          .nav-logo {
            font-size: 16px;
          }
          .nav-links {
            gap: 2px;
          }
          .nav-link {
            font-size: 11px;
            padding: 4px 10px;
          }
          .hero-content h1 {
            font-size: 20px;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .hero-actions .btn-primary,
          .hero-actions .btn-secondary {
            width: 100%;
            justify-content: center;
          }
          .hero-stats {
            flex-wrap: wrap;
            justify-content: center;
          }
          .books-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .book-card {
            padding: 12px;
          }
          .book-image {
            font-size: 28px;
          }
          .book-info h3 {
            font-size: 12px;
          }
          .book-footer .btn-sm {
            padding: 4px 10px;
            font-size: 10px;
            min-height: 28px;
          }
          .book-price {
            font-size: 14px;
          }
          .courses-grid {
            grid-template-columns: 1fr;
          }
          .admin-stats {
            grid-template-columns: 1fr;
          }
          .user-table {
            font-size: 11px;
          }
          .user-table th,
          .user-table td {
            padding: 6px 8px;
          }
          .btn-danger {
            font-size: 10px;
            padding: 3px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;