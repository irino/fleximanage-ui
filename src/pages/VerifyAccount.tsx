
// src/pages/VerifyAccount.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckCircle, Hash, Key, Languages } from "lucide-react";
import { verifyAccount } from "../api/verifyAccount";
import "./Form.css";

export default function VerifyAccount() {
  const { t, i18n } = useTranslation();
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await verifyAccount(id, token);
      setSuccess(true);
      setMsg(t("Verification Success"));
    } catch (err: any) {
      setMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="lang-switch-container">
        <Languages size={16} className="lang-switch-icon" />
        <button
          onClick={() => changeLanguage('ja')}
          className={`lang-switch-btn ${i18n.language === 'ja' ? 'active' : ''}`}
        >日本語</button>
        <button
          onClick={() => changeLanguage('en')}
          className={`lang-switch-btn ${i18n.language.startsWith('en') ? 'active' : ''}`}
        >EN</button>
      </div>

      <div className="form-logo">
        <div className="form-logo-inner form-logo-inner-success">
          <CheckCircle size={32} />
        </div>
      </div>

      <h2 className="form-title">{t("Verify Account")}</h2>
      <p className="form-subtitle">Confirm your registration details to activate your account</p>

      {msg && (
        <div className={`alert ${success ? 'alert-success' : 'alert-error'}`}>
          <span className="alert-icon">{success ? '✅' : '⚠️'}</span>
          {msg}
        </div>
      )}

      {success ? (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" className="form-submit-btn" style={{ textDecoration: 'none', display: 'block' }}>
            {t("Login Here")}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="form">
          <div className="form-group">
            <label className="form-label">{t("ID")}</label>
            <div className="form-input-wrapper">
              <Hash size={18} className="form-input-icon" />
              <input
                className="form-input form-input-with-icon"
                value={id}
                onChange={e => setId(e.target.value)}
                required
                placeholder="Account ID"
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t("Token")}</label>
            <div className="form-input-wrapper">
              <Key size={18} className="form-input-icon" />
              <input
                className="form-input form-input-with-icon"
                value={token}
                onChange={e => setToken(e.target.value)}
                required
                placeholder="Verification Token"
                disabled={loading}
              />
            </div>
          </div>
          <button type="submit" className="form-submit-btn" disabled={loading}>
            {loading ? t('Loading...') : t("Verify")}
          </button>

          <div className="form-footer">
            <Link to="/login" className="form-footer-link">
              ← {t("Login Here")}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
