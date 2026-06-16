import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    email: '',
    role: 'USER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.username || !user.password || !user.email) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (user.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (!agreed) {
      setError('Veuillez accepter les conditions d\'utilisation');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(user);
      setSuccess('🎉 Compte créé avec succès ! Redirection...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="register-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="register-wrapper glass">
        <div className="register-header">
          <div className="register-icon">✨</div>
          <h2>Rejoignez SecurLearn</h2>
          <p className="register-subtitle">Créez votre compte et accédez à des milliers de ressources cyber</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>👤 Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              placeholder="Choisissez un nom d'utilisateur"
              value={user.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={user.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>🔑 Mot de passe</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Minimum 6 caractères"
                value={user.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="password-hint">
            <span>🔒</span> Le mot de passe doit contenir au moins 6 caractères
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-text">
              J'accepte les <Link to="/terms" className="link-primary">conditions d'utilisation</Link> et la <Link to="/privacy" className="link-primary">politique de confidentialité</Link>
            </span>
          </label>

          {error && (
            <div className="form-error">
              <span className="error-icon">⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="form-success">
              <span>🎉</span> {success}
            </div>
          )}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Création en cours...
              </>
            ) : (
              'Créer mon compte →'
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
              Déjà un compte ?{' '}
              <Link to="/login" className="link-primary">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f0f5f2;
          position: relative;
          overflow: hidden;
        }

        .register-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.05;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: var(--primary);
          top: -100px;
          right: -100px;
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: var(--primary-light);
          bottom: -80px;
          left: -80px;
          animation: float 8s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          background: var(--primary);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .register-wrapper {
          max-width: 480px;
          width: 100%;
          padding: 40px 44px;
          border-radius: var(--radius-xl);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: var(--shadow-xl);
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease forwards;
        }

        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .register-icon {
          font-size: 44px;
          margin-bottom: 12px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        .register-header h2 {
          font-size: 28px;
          color: var(--gray-900);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }

        .register-subtitle {
          color: var(--gray-500);
          font-size: 14px;
        }

        .register-form .input-group {
          margin-bottom: 16px;
        }

        .register-form .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 4px;
          display: block;
        }

        .register-form .input-group input {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 15px;
          background: var(--off-white);
          transition: var(--transition);
          outline: none;
          color: var(--gray-800);
          font-family: inherit;
          min-height: 50px;
        }

        .register-form .input-group input:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .register-form .input-group input::placeholder {
          color: var(--gray-400);
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          padding-right: 48px !important;
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

        .password-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--gray-500);
          margin: -8px 0 16px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: var(--gray-600);
          cursor: pointer;
          margin-bottom: 20px;
          padding: 8px 0;
        }

        .checkbox-label input {
          display: none;
        }

        .checkbox-label .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid var(--gray-300);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          flex-shrink: 0;
          margin-top: 1px;
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

        .checkbox-text {
          line-height: 1.4;
        }

        .checkbox-text .link-primary {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .checkbox-text .link-primary:hover {
          text-decoration: underline;
        }

        .btn-full {
          width: 100%;
          justify-content: center;
          margin-top: 4px;
          font-size: 16px;
          min-height: 54px;
          border-radius: var(--radius-md);
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

        .form-success {
          background: #f0fdf4;
          color: #16a34a;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 4px solid #16a34a;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 20px 0;
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
          margin-bottom: 20px;
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
          to { transform: rotate(360deg); }
        }

        @media (max-width: 520px) {
          .register-wrapper {
            padding: 28px 20px;
            border-radius: var(--radius-lg);
          }
          .register-header h2 {
            font-size: 24px;
          }
          .register-form .input-group input {
            padding: 12px 16px;
            font-size: 14px;
            min-height: 44px;
          }
          .btn-full {
            font-size: 15px;
            min-height: 48px;
          }
          .social-login {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 400px) {
          .register-wrapper {
            padding: 20px 16px;
          }
          .register-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;