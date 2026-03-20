
// src/pages/RegisterAccount.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Building, Briefcase, Languages } from "lucide-react";
import { registerAccount } from "../api/registerAccount";
import "./Form.css";

export default function RegisterAccount() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({
    accountName: "",
    userFirstName: "",
    userLastName: "",
    email: "",
    userJobTitle: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await registerAccount(form);
      setSuccess(true);
      // Keep form data for a moment so user can see what they registered
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
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
          <UserPlus size={32} />
        </div>
      </div>

      <h2 className="form-title">{t("Create Account Header")}</h2>
      <p className="form-subtitle">{t("Account registration info")}</p>


      {error && <div className="alert alert-error"><span className="alert-icon">⚠️</span> {error}</div>}

      {success && (
        <div className="alert alert-success" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>✅ {t("Success Registration")}</div>
          <p>{t("Verify Account Button")}</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#155724' }}>
            {t("Activation Manual Info")}{' '}
            <Link to="/verify" style={{ color: '#155724', fontWeight: 'bold', textDecoration: 'underline' }}>
              {t("Verify Account Link")}
            </Link>
          </p>
          <Link to="/login" className="form-submit-btn" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
            {t("Login Here")}
          </Link>
        </div>
      )}

      {!success && (
        <form onSubmit={submit} className="form">
          <div className="form-group">
            <label className="form-label">{t("Account Name")} *</label>
            <div className="form-input-wrapper">
              <Building size={18} className="form-input-icon" />
              <input
                type="text"
                className="form-input form-input-with-icon"
                placeholder={t("Company or Org Name")}
                value={form.accountName}
                onChange={(e) => update("accountName", e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <p className="form-help-text">{t("Example")}: Acme Corporation</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">{t("First Name")} *</label>
              <div className="form-input-wrapper">
                <User size={18} className="form-input-icon" />
                <input
                  type="text"
                  className="form-input form-input-with-icon"
                  placeholder={t("First Name Placeholder")}
                  value={form.userFirstName}
                  onChange={(e) => update("userFirstName", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t("Last Name")} *</label>
              <div className="form-input-wrapper">
                <User size={18} className="form-input-icon" />
                <input
                  type="text"
                  className="form-input form-input-with-icon"
                  placeholder={t("Last Name Placeholder")}
                  value={form.userLastName}
                  onChange={(e) => update("userLastName", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t("Email")} *</label>
            <div className="form-input-wrapper">
              <Mail size={18} className="form-input-icon" />
              <input
                type="email"
                className="form-input form-input-with-icon"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t("Job Title")}</label>
            <div className="form-input-wrapper">
              <Briefcase size={18} className="form-input-icon" />
              <input
                type="text"
                className="form-input form-input-with-icon"
                placeholder={t("Job Title Placeholder")}
                value={form.userJobTitle}
                onChange={(e) => update("userJobTitle", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t("Password")} *</label>
            <div className="form-input-wrapper">
              <Lock size={18} className="form-input-icon" />
              <input
                type="password"
                className="form-input form-input-with-icon"
                placeholder={t("Password Placeholder")}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>
          </div>

          <button type="submit" className="form-submit-btn" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? t("Creating...") : t("Create Account Header")}
          </button>

          <div className="form-footer">
            <p>{t("Already have an account?")}{' '}<Link to="/login" className="form-footer-link">{t("Login Here")}</Link></p>
            <p style={{ marginTop: '0.5rem' }}>
              {t("Need to activate your account?")}{' '}
              <Link to="/verify" className="form-footer-link">
                {t("Verify Account")}
              </Link>
            </p>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">⚠️ {t("Important Notes")}</h3>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem", lineHeight: "1.6", color: "#475569" }}>
              {i18n.language === 'ja' ? (
                <>
                  <li>アカウント作成後、登録したメールアドレスに確認メールが送信されます</li>
                  <li>メールが届かない場合は、迷惑メールフォルダをご確認ください</li>
                  <li>Microsoft Office 365をお使いの場合、ブラウザの保護機能によりブロックされる可能性があります</li>
                </>
              ) : (
                <>
                  <li>A confirmation email will be sent after account creation</li>
                  <li>If you don't receive it, please check your spam folder</li>
                  <li>If using Office 365, the mail might be suppressed by system filters</li>
                </>
              )}
            </ul>
          </div>
        </form>
      )}
    </div>
  );
}
