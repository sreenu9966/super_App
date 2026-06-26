import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { fetchMovieDetails } from "../services/apiServices";
import { Star, Clock, X, Film, Calendar, User, Users, Bookmark } from "lucide-react";

const MovieModal = ({ movieId, onClose }) => {
  const apiKeys = useStore((state) => state.apiKeys);
  const watchlist = useStore((state) => state.watchlist);
  const addToWatchlist = useStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useStore((state) => state.removeFromWatchlist);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetails(movieId, apiKeys.movies);
        if (active) {
          if (data.Response === "False") {
            setError(data.Error || "Movie details not found.");
          } else {
            setDetails(data);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Network error. Unable to load movie details.");
          setLoading(false);
        }
      }
    };

    if (movieId) {
      loadDetails();
    }

    return () => {
      active = false;
    };
  }, [movieId, apiKeys.movies]);

  const isBookmarked = details && watchlist.some((m) => m.imdbID === details.imdbID);

  const handleWatchlistToggle = () => {
    if (!details) return;
    if (isBookmarked) {
      removeFromWatchlist(details.imdbID);
    } else {
      addToWatchlist({
        imdbID: details.imdbID,
        Title: details.Title,
        Year: details.Year,
        Poster: details.Poster
      });
    }
  };

  return (
    <div className="movie-modal-overlay" onClick={onClose}>
      <div 
        className="movie-modal-container glass-panel animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="movie-modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {loading && (
          <div className="modal-loading-pane flex-center">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: "1rem" }}>Loading movie profile...</p>
          </div>
        )}

        {error && (
          <div className="modal-error-pane flex-center">
            <p className="error-text">{error}</p>
            <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: "1rem" }}>Close</button>
          </div>
        )}

        {!loading && !error && details && (
          <div className="movie-details-grid">
            <div className="movie-details-poster-pane">
              {details.Poster && details.Poster !== "N/A" ? (
                <img src={details.Poster} alt={details.Title} className="details-poster-img" />
              ) : (
                <div className="details-poster-fallback">
                  <Film size={48} />
                  <span>No Poster</span>
                </div>
              )}
            </div>

            <div className="movie-details-text-pane">
              <div className="details-header-row">
                <h2 className="details-title">{details.Title}</h2>
                <span className="details-year-tag">{details.Year}</span>
              </div>

              <div className="details-meta-row">
                <div className="details-rating">
                  <Star size={16} className="star-icon" fill="currentColor" />
                  <span>{details.imdbRating} / 10</span>
                </div>
                
                <div className="details-runtime">
                  <Clock size={16} className="clock-icon" />
                  <span>{details.Runtime}</span>
                </div>
              </div>

              <button 
                onClick={handleWatchlistToggle} 
                className={`watchlist-bookmark-btn ${isBookmarked ? "active" : ""}`}
              >
                <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? "Saved in Watchlist" : "Add to Watchlist"}
              </button>

              <div className="details-genres">
                {details.Genre && details.Genre.split(",").map((g, idx) => (
                  <span key={idx} className="genre-pill">{g.trim()}</span>
                ))}
              </div>

              <div className="details-section">
                <h4>Synopsis</h4>
                <p className="details-plot">{details.Plot}</p>
              </div>

              <div className="details-people-section">
                <div className="people-row">
                  <User size={14} className="people-icon" />
                  <span className="people-label">Director:</span>
                  <span className="people-name">{details.Director}</span>
                </div>
                <div className="people-row">
                  <Users size={14} className="people-icon" />
                  <span className="people-label">Starring:</span>
                  <span className="people-name">{details.Actors}</span>
                </div>
                <div className="people-row">
                  <Calendar size={14} className="people-icon" />
                  <span className="people-label">Released:</span>
                  <span className="people-name">{details.Released}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
