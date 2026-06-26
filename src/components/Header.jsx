import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Settings, LogOut, Key, CheckCircle, HelpCircle, Menu, X } from "lucide-react";

const Header = () => {
  const { user, apiKeys, setApiKeys, resetStore } = useStore();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [inputKeys, setInputKeys] = useState({ ...apiKeys });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSaveKeys = (e) => {
    e.preventDefault();
    setApiKeys(inputKeys);
    setShowSettings(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to reset all user registration data and notes?")) {
      resetStore();
      navigate("/");
    }
  };

  return (
    <>
      <header className="app-header glass-panel">
        <div className="header-logo-section" onClick={() => navigate("/dashboard")}>
          <span className="logo-text">Super App</span>
          <span className="logo-badge">Dashboard Hub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-only">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/movies" 
            className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
          >
            Movies
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions desktop-only">
          {/* User profile identifier */}
          <div className="header-user-tag" onClick={() => navigate("/categories")}>
            <span className="user-initial">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
            <span className="user-fullname">{user?.username || "user"}</span>
          </div>

          {/* Settings button */}
          <button 
            onClick={() => setShowSettings(true)} 
            className="header-action-btn"
            title="API Credentials Settings"
          >
            <Settings size={18} />
          </button>

          {/* Logout button */}
          <button 
            onClick={handleLogout} 
            className="header-action-btn danger" 
            title="Log Out & Reset App"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-dropdown-menu glass-panel animate-slide-up">
            <div className="mobile-menu-user-row" onClick={() => { navigate("/categories"); setIsMobileMenuOpen(false); }}>
              <span className="user-initial">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span className="user-fullname">{user?.username || "user"}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-primary)" }}>Edit Interests</span>
              </div>
            </div>
            
            <hr className="mobile-menu-divider" />

            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/movies" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </NavLink>

            <hr className="mobile-menu-divider" />

            <button 
              onClick={() => { setShowSettings(true); setIsMobileMenuOpen(false); }} 
              className="mobile-menu-action-btn"
            >
              <Settings size={16} />
              <span>API Key Config</span>
            </button>

            <button 
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
              className="mobile-menu-action-btn danger"
            >
              <LogOut size={16} />
              <span>Log Out & Reset</span>
            </button>
          </div>
        )}
      </header>

      {/* Settings Modal Dialog */}
      {showSettings && (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal-content glass-panel animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-group">
                <Key className="title-icon" size={20} />
                <h3>API Key Configurations</h3>
              </div>
              <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
            </div>
            
            <p className="modal-sub">
              By default, the app runs in <strong>Mock Mode</strong> with high-fidelity pre-compiled data. Paste your credentials below to enable live network operations.
            </p>

            <form onSubmit={handleSaveKeys}>
              <div className="form-group">
                <label className="form-label">OpenWeatherMap API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Paste weather api key..."
                  value={inputKeys.weather}
                  onChange={(e) => setInputKeys({ ...inputKeys, weather: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">NewsData.io API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Paste news api key..."
                  value={inputKeys.news}
                  onChange={(e) => setInputKeys({ ...inputKeys, news: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">OMDB Movie API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Paste omdb api key..."
                  value={inputKeys.movies}
                  onChange={(e) => setInputKeys({ ...inputKeys, movies: e.target.value })}
                />
              </div>

              <div className="keys-status-box">
                <h4>Active Mode:</h4>
                <div className="status-item">
                  <span className="status-label">Weather Service:</span>
                  {apiKeys.weather ? (
                    <span className="status-active"><CheckCircle size={12} /> Live API</span>
                  ) : (
                    <span className="status-mock"><HelpCircle size={12} /> Mock Mode (Fallback)</span>
                  )}
                </div>
                <div className="status-item">
                  <span className="status-label">News Service:</span>
                  {apiKeys.news ? (
                    <span className="status-active"><CheckCircle size={12} /> Live API</span>
                  ) : (
                    <span className="status-mock"><HelpCircle size={12} /> Mock Mode (Fallback)</span>
                  )}
                </div>
                <div className="status-item">
                  <span className="status-label">Movies Recommendation:</span>
                  {apiKeys.movies ? (
                    <span className="status-active"><CheckCircle size={12} /> Live API</span>
                  ) : (
                    <span className="status-mock"><HelpCircle size={12} /> Mock Mode (Fallback)</span>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
