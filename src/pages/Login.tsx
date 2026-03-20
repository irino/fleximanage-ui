
// src/pages/Login.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Mail, Lock, Languages } from 'lucide-react';
import { login } from '../api/login';
import './Form.css';

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await login(email, password, '');

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }

      const { token, userId } = response as { token: string; userId: string };

      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);

      setSuccess(true);
      setTimeout(() => navigate('/home'), 1000);

    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : t('Login Failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header-actions">
        <div className="language-selector-wrapper" style={{ border: 'none', background: 'rgba(255,255,255,0.5)' }}>
          <Languages size={16} className="icon-muted" />
          <select
            value={i18n.language.startsWith('en') ? 'en' : 'ja'}
            onChange={handleLanguageChange}
            className="lang-select"
            style={{ fontSize: '0.75rem' }}
          >
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>

      <div className="form-logo">
        <div className="form-logo-inner">
          <Shield size={32} />
        </div>
      </div>

      <h2 className="form-title">{t('Login')}</h2>
      <p className="form-subtitle">Secure access to flexiManage</p>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {t('Login Success')}
        </div>
      )}


      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">{t('Username (Email)')}</label>
          <div className="form-input-wrapper">
            <Mail size={18} className="form-input-icon" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="user@example.com"
              className="form-input form-input-with-icon"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="login-password" className="form-label">{t('Password')}</label>
          <div className="form-input-wrapper">
            <Lock size={18} className="form-input-icon" />
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder={t('Password Placeholder')}
              className="form-input form-input-with-icon"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="form-submit-btn">
          {loading ? t('Logging in...') : t('Login')}
        </button>
      </form>

      <div className="form-footer">
        {t("Don't have an account?")}{' '}
        <Link to="/register" className="form-footer-link">
          {t('Create Account Here')}
        </Link>
      </div>
    </div>
  );
}
