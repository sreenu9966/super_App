import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Settings, LogOut, Key, CheckCircle, HelpCircle, Menu, X, Bookmark } from "lucide-react";
import MovieModal from "./MovieModal";

const Header = () => {
  const { user, apiKeys, setApiKeys, resetStore, watchlist, removeFromWatchlist } = useStore();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookmarksDropdown, setShowBookmarksDropdown] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
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
          <div className="header-user-tag" onClick={() => setShowProfileModal(true)}>
            <span className="user-initial">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
            <span className="user-fullname">{user?.username || "user"}</span>
          </div>

          {/* Watchlist Bookmarks button */}
          <button 
            onClick={() => setShowBookmarksDropdown(!showBookmarksDropdown)} 
            className={`header-action-btn ${watchlist && watchlist.length > 0 ? "active-watchlist" : ""}`}
            title="My Bookmarked Watchlist"
            style={{ position: "relative" }}
          >
            <Bookmark size={18} fill={watchlist && watchlist.length > 0 ? "currentColor" : "none"} />
            {watchlist && watchlist.length > 0 && (
              <span className="badge-count" style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--color-primary)",
                color: "#0b0c10",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "0.65rem",
                fontWeight: "900",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #0b0c10"
              }}>
                {watchlist.length}
              </span>
            )}
          </button>

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
            <div className="mobile-menu-user-row" onClick={() => { setShowProfileModal(true); setIsMobileMenuOpen(false); }}>
              <span className="user-initial">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span className="user-fullname">{user?.username || "user"}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-primary)" }}>View Profile</span>
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
              onClick={() => { setShowBookmarksDropdown(true); setIsMobileMenuOpen(false); }} 
              className="mobile-menu-action-btn"
            >
              <Bookmark size={16} fill={watchlist && watchlist.length > 0 ? "currentColor" : "none"} />
              <span>Bookmarks ({watchlist ? watchlist.length : 0})</span>
            </button>

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

      {/* User Profile Modal Dialog */}
      {showProfileModal && (
        <div className="settings-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="settings-modal-content glass-panel animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <div className="title-group">
                <span className="user-initial" style={{ width: "30px", height: "30px", fontSize: "0.95rem" }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <h3>User Profile Details</h3>
              </div>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>×</button>
            </div>

            <div className="profile-top-info" style={{ display: "flex", gap: "1.25rem", padding: "1.5rem 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div className="profile-avatar-container" style={{ position: "relative" }}>
                <div className="profile-avatar" style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                  color: "#0b0c10",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: "900",
                  boxShadow: "0 0 20px rgba(102, 252, 241, 0.4)"
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <div className="profile-text-info" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 className="profile-name" style={{ fontSize: "1.35rem", fontWeight: "800", color: "#fff", margin: 0 }}>{user?.name}</h2>
                <h3 className="profile-username" style={{ fontSize: "0.9rem", color: "var(--color-primary)", margin: "0.15rem 0 0.35rem 0", fontWeight: "500" }}>@{user?.username}</h3>
              </div>
            </div>

            <div className="profile-details-list" style={{ padding: "1.25rem 0", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Email Address</span>
                <span style={{ color: "#fff", fontWeight: "500" }}>{user?.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Mobile Number</span>
                <span style={{ color: "#fff", fontWeight: "500" }}>{user?.mobile}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Selected Interests</span>
                <span style={{ color: "var(--color-accent)", fontWeight: "600" }}>{useStore.getState().categories.length} Selected</span>
              </div>
            </div>

            <div className="profile-categories-section" style={{ paddingBottom: "1.5rem" }}>
              <div className="profile-category-chips" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                {useStore.getState().categories.map((catId) => {
                  const names = {
                    action: "Action",
                    comedy: "Comedy",
                    drama: "Drama",
                    music: "Music",
                    sports: "Sports",
                    thriller: "Thriller",
                    fantasy: "Fantasy",
                    romance: "Romance",
                  };
                  return (
                    <span key={catId} className={`profile-chip chip-${catId}`} style={{
                      padding: "0.3rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff"
                    }}>
                      {names[catId] || catId}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="modal-actions" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "1.25rem" }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowProfileModal(false);
                  navigate("/categories");
                }}
                style={{ flex: 1 }}
              >
                Change Interests
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setShowProfileModal(false)}
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Dropdown Overlay Panel */}
      {showBookmarksDropdown && (
        <div className="bookmarks-dropdown-overlay" onClick={() => setShowBookmarksDropdown(false)}>
          <div className="bookmarks-dropdown-panel glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Bookmark size={16} style={{ color: "var(--color-primary)" }} fill={watchlist && watchlist.length > 0 ? "currentColor" : "none"} />
                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: "700" }}>Watchlist Bookmarks</h4>
              </div>
              <span style={{ fontSize: "0.75rem", background: "rgba(102, 252, 241, 0.1)", color: "var(--color-primary)", padding: "0.15rem 0.5rem", borderRadius: "10px", fontWeight: "600" }}>
                {watchlist ? watchlist.length : 0} Saved
              </span>
            </div>

            <div className="dropdown-items-list" style={{ maxHeight: "280px", overflowY: "auto", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {!watchlist || watchlist.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", padding: "1.5rem 0", margin: 0 }}>
                  Your watchlist is empty.
                </p>
              ) : (
                watchlist.map((movie) => (
                  <div 
                    key={movie.imdbID} 
                    className="dropdown-item-row" 
                    onClick={() => {
                      setSelectedMovieId(movie.imdbID);
                      setShowBookmarksDropdown(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem",
                      borderRadius: "var(--border-radius-sm)",
                      cursor: "pointer",
                      transition: "var(--transition-smooth)",
                      background: "rgba(255, 255, 255, 0.02)"
                    }}
                  >
                    <img 
                      src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/40x60"} 
                      alt={movie.Title} 
                      style={{ width: "35px", height: "50px", borderRadius: "4px", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ margin: 0, fontSize: "0.85rem", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={movie.Title}>
                        {movie.Title}
                      </h5>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{movie.Year}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(movie.imdbID);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        padding: "0.25rem",
                        transition: "color 0.2s"
                      }}
                      title="Remove Bookmark"
                      className="trash-btn"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render detailed movie popup overlay */}
      {selectedMovieId && (
        <MovieModal 
          movieId={selectedMovieId} 
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </>
  );
};

export default Header;
