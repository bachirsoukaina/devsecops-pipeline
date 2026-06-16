import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Effet de particules pour le background
  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.particles-container');
      if (!container) return;
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
        particle.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(particle);
      }
    };
    createParticles();
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await login(credentials);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* PARTICLES BACKGROUND */}
      <div className="particles-container"></div>
      
      {/* DECORATIVE ELEMENTS */}
      <div className="deco-circle-1 float-slow"></div>
      <div className="deco-circle-2 float"></div>
      <div className="deco-circle-3"></div>
      
      <div className="login-wrapper">
        {/* LEFT PANEL - BRANDING */}
        <div className="login-brand-panel">
          <div className="brand-content">
            <div className="brand-badge pulse-glow">
              <span className="brand-badge-icon">🔒</span>
              <span>Sécurité certifiée</span>
            </div>
            
            <div className="brand-logo">
              <div className="logo-icon">
                <span>🛡️</span>
              </div>
              <h1>Secur<span>Learn</span></h1>
            </div>
            
            <p className="brand-tagline">
              La plateforme premium de réservation de <br />
              livres et formations en cybersécurité
            </p>
            
            <div className="brand-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Livres disponibles</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Formations certifiées</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Apprenants actifs</span>
              </div>
            </div>
            
            <div className="brand-features">
              <div className="feature-item slide-in-left" style={{ animationDelay: '0.2s' }}>
                <span className="feature-icon">📚</span>
                <span>Bibliothèque Cyber sécurisée</span>
              </div>
              <div className="feature-item slide-in-left" style={{ animationDelay: '0.3s' }}>
                <span className="feature-icon">🎓</span>
                <span>Parcours certifiants</span>
              </div>
              <div className="feature-item slide-in-left" style={{ animationDelay: '0.4s' }}>
                <span className="feature-icon">🤝</span>
                <span>Communauté d'experts</span>
              </div>
            </div>
            
            <div className="brand-testimonial">
              <div className="testimonial-avatars">
                <div className="avatar" style={{ background: '#0a7a2e' }}>JD</div>
                <div className="avatar" style={{ background: '#065a21' }}>SM</div>
                <div className="avatar" style={{ background: '#1a9e44' }}>AL</div>
                <div className="avatar-more">+150</div>
              </div>
              <p className="testimonial-text">
                "SecurLearn a transformé notre façon d'apprendre la cybersécurité"
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="login-form-panel">
          <div className="form-wrapper glass">
            <div className="form-header">
              <h2>Bienvenue sur SecurLearn</h2>
              <p className="form-subtitle">
                Connectez-vous pour accéder à votre bibliothèque sécurisée
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>
                  <span className="label-icon">👤</span>
                  Nom d'utilisateur
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={credentials.username}
                    onChange={handleChange}
                    className={error ? 'error' : ''}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              <div className="input-group">
                <label>
                  <span className="label-icon">🔑</span>
                  Mot de passe
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    className={error ? 'error' : ''}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="form-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Rester connecté
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <span>Accéder à ma bibliothèque</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              <div className="divider">
                <span>ou</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn">
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn">
                  <span>GitHub</span>
                </button>
              </div>

              <div className="form-footer">
                <p>
                  Nouveau sur SecurLearn ?{' '}
                  <Link to="/register" className="link-primary">
                    Créer un compte gratuit
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* SECURITY BADGE */}
          <div className="security-badge">
            <span className="sec-icon">🔐</span>
            <span>Connexion sécurisée • Chiffrement SSL</span>
          </div>
        </div>
      </div>

      <style>{`
        /* ===== LOGIN PAGE ===== */
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f5f2;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* PARTICLES */
        .particles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          background: var(--primary);
          border-radius: 50%;
          opacity: 0.15;
          animation: floatParticle linear infinite;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.15;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-10vh) scale(1);
            opacity: 0;
          }
        }

        /* DECORATIVE CIRCLES */
        .deco-circle-1 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(10, 122, 46, 0.06), transparent 70%);
          top: -200px;
          right: -100px;
          pointer-events: none;
          z-index: 0;
        }

        .deco-circle-2 {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(10, 122, 46, 0.04), transparent 70%);
          bottom: -100px;
          left: -50px;
          pointer-events: none;
          z-index: 0;
        }

        .deco-circle-3 {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(10, 122, 46, 0.03), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }

        /* WRAPPER */
        .login-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.08);
          position: relative;
          z-index: 1;
          min-height: 680px;
        }

        /* ===== LEFT PANEL ===== */
        .login-brand-panel {
          background: var(--primary-gradient);
          padding: 48px 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .login-brand-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .brand-content {
          position: relative;
          z-index: 1;
          max-width: 400px;
          width: 100%;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px 6px 10px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 32px;
        }

        .brand-badge-icon {
          font-size: 14px;
        }

        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .logo-icon {
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .brand-logo h1 {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .brand-logo h1 span {
          color: #7ddfa0;
        }

        .brand-tagline {
          font-size: 16px;
          opacity: 0.85;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .brand-stats {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          gap: 0;
          padding: 20px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 28px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.7;
        }

        .stat-divider {
          width: 1px;
          background: rgba(255, 255, 255, 0.15);
        }

        .brand-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          opacity: 0.9;
        }

        .feature-icon {
          font-size: 18px;
          width: 32px;
          text-align: center;
        }

        .brand-testimonial {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .testimonial-avatars {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .testimonial-avatars .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          margin-right: -8px;
        }

        .testimonial-avatars .avatar-more {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          margin-right: -8px;
        }

        .testimonial-text {
          font-size: 13px;
          opacity: 0.85;
          font-style: italic;
          line-height: 1.4;
        }

        /* ===== RIGHT PANEL ===== */
        .login-form-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          background: white;
          position: relative;
        }

        .form-wrapper {
          width: 100%;
          max-width: 400px;
          padding: 0;
          background: transparent;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
        }

        .form-header {
          margin-bottom: 32px;
        }

        .form-header h2 {
          font-size: 30px;
          color: var(--gray-900);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .form-subtitle {
          color: var(--gray-500);
          font-size: 15px;
          line-height: 1.5;
        }

        .login-form .input-group {
          margin-bottom: 20px;
        }

        .login-form .input-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 4px;
        }

        .label-icon {
          font-size: 16px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 48px 14px 18px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 15px;
          background: var(--off-white);
          transition: var(--transition);
          outline: none;
          color: var(--gray-800);
          font-family: inherit;
          min-height: 52px;
        }

        .input-wrapper input:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .input-wrapper input::placeholder {
          color: var(--gray-400);
        }

        .toggle-password {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.5;
          transition: var(--transition);
          padding: 4px;
        }

        .toggle-password:hover {
          opacity: 1;
        }

        .form-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 4px solid #dc2626;
        }

        .error-icon {
          font-size: 16px;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--gray-600);
          cursor: pointer;
          position: relative;
        }

        .checkbox-label input {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid var(--gray-300);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .checkbox-label input:checked + .checkmark {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkbox-label input:checked + .checkmark::after {
          content: '✓';
          color: white;
          font-size: 13px;
          font-weight: 700;
        }

        .forgot-link {
          font-size: 14px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
        }

        .forgot-link:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .btn-full {
          width: 100%;
          justify-content: center;
          margin-top: 4px;
          font-size: 16px;
          min-height: 54px;
          border-radius: var(--radius-md);
          position: relative;
        }

        .btn-arrow {
          display: inline-block;
          transition: var(--transition);
        }

        .btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
          color: var(--gray-400);
          font-size: 13px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--gray-200);
        }

        .social-login {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .social-btn {
          padding: 12px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-700);
          cursor: pointer;
          transition: var(--transition);
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .social-btn:hover {
          border-color: var(--primary);
          background: var(--primary-soft);
          transform: translateY(-2px);
        }

        .form-footer {
          text-align: center;
          color: var(--gray-500);
          font-size: 14px;
        }

        .link-primary {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
        }

        .link-primary:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        /* SECURITY BADGE */
        .security-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          font-size: 12px;
          color: var(--gray-400);
          opacity: 0.7;
        }

        .sec-icon {
          font-size: 14px;
        }

        /* SPINNER */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          flex-shrink: 0;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(10, 122, 46, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(10, 122, 46, 0.2);
          }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .login-wrapper {
            grid-template-columns: 1fr;
            max-width: 520px;
            border-radius: 24px;
            min-height: auto;
          }
          
          .login-brand-panel {
            padding: 36px 32px;
            border-radius: 24px 24px 0 0;
          }
          
          .login-form-panel {
            padding: 32px 28px;
          }
          
          .brand-stats {
            grid-template-columns: 1fr auto 1fr auto 1fr;
          }
          
          .brand-tagline br {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .login-page {
            padding: 12px;
          }
          
          .login-wrapper {
            border-radius: 20px;
          }
          
          .login-brand-panel {
            padding: 28px 20px;
          }
          
          .brand-logo h1 {
            font-size: 28px;
          }
          
          .brand-stats {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px 0;
          }
          
          .stat-divider {
            display: none;
          }
          
          .login-form-panel {
            padding: 24px 16px;
          }
          
          .form-header h2 {
            font-size: 24px;
          }
          
          .social-login {
            grid-template-columns: 1fr;
          }
          
          .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .brand-testimonial {
            flex-direction: column;
            text-align: center;
            padding: 14px 16px;
          }
        }

        @media (max-width: 400px) {
          .login-brand-panel {
            padding: 20px 16px;
          }
          
          .brand-logo h1 {
            font-size: 24px;
          }
          
          .brand-tagline {
            font-size: 14px;
          }
          
          .login-form-panel {
            padding: 20px 12px;
          }
          
          .input-wrapper input {
            padding: 12px 40px 12px 14px;
            font-size: 14px;
            min-height: 44px;
          }
          
          .btn-full {
            font-size: 15px;
            min-height: 48px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;