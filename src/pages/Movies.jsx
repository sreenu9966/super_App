import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MovieModal from "../components/MovieModal";
import { useStore } from "../store/useStore";
import { searchMovieByGenre } from "../services/apiServices";
import { Film, Play, ChevronLeft, ChevronRight } from "lucide-react";

const Movies = () => {
  const { categories, apiKeys, watchlist } = useStore();
  const [moviesByCategory, setMoviesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadAllMovies = async () => {
      setLoading(true);
      const results = {};

      try {
        await Promise.all(
          categories.map(async (catId) => {
            const list = await searchMovieByGenre(catId, apiKeys.movies);
            results[catId] = list;
          })
        );

        if (active) {
          setMoviesByCategory(results);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load movies by category:", err);
        if (active) setLoading(false);
      }
    };

    if (categories && categories.length > 0) {
      loadAllMovies();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [categories, apiKeys.movies]);

  const getCategoryTitle = (id) => {
    const names = {
      action: "Action & Adventure",
      comedy: "Comedy Hits",
      drama: "Critically Acclaimed Drama",
      music: "Musicals & Concerts",
      sports: "Sports & Competition",
      thriller: "Suspenseful Thrillers",
      fantasy: "Sci-Fi & Fantasy",
      romance: "Romantic Stories",
    };
    return names[id] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  const scrollContainer = (id, direction) => {
    const el = document.getElementById(id);
    if (el) {
      const scrollAmount = 480;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="movies-page-container animate-fade-in">
      <Header />

      <main className="movies-main-content container">
        <div className="movies-page-header">
          <h2>Suggested Entertainment For You</h2>
          <p>Personalized recommendations compiled based on your onboard interest chips.</p>
        </div>

        {/* Watchlist Section */}
        <div className="watchlist-section animate-slide-up">
          <div className="category-section-header">
            <h3 className="category-section-title" style={{ color: "var(--color-primary)", paddingLeft: "0.75rem" }}>
              My Bookmark Watchlist
            </h3>
            <span className="count-badge">{watchlist.length} Saved</span>
          </div>

          {watchlist.length === 0 ? (
            <p className="no-movies-text" style={{ padding: "0.5rem 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Your watchlist is currently empty. Tap on any movie card below and click "Add to Watchlist" to save it here.
            </p>
          ) : (
            <div className="movie-carousel-container">
              <button 
                className="scroll-arrow-btn left" 
                onClick={() => scrollContainer("scroll-watchlist", "left")}
                title="Scroll Left"
              >
                <ChevronLeft size={20} />
              </button>

              <div id="scroll-watchlist" className="movie-horizontal-scroll">
                {watchlist.map((movie) => (
                  <div 
                    key={movie.imdbID} 
                    className="movie-card-wrapper"
                    onClick={() => setSelectedMovieId(movie.imdbID)}
                  >
                    <div className="movie-card-poster">
                      {movie.Poster && movie.Poster !== "N/A" ? (
                        <img src={movie.Poster} alt={movie.Title} className="movie-poster-img" />
                      ) : (
                        <div className="movie-poster-fallback">
                          <Film size={32} />
                        </div>
                      )}
                      <div className="movie-card-hover-overlay">
                        <div className="play-icon-circle">
                          <Play size={20} fill="currentColor" />
                        </div>
                        <span>View Info</span>
                      </div>
                    </div>
                    <div className="movie-card-info">
                      <h4 className="movie-card-title" title={movie.Title}>{movie.Title}</h4>
                      <span className="movie-card-year">{movie.Year}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="scroll-arrow-btn right" 
                onClick={() => scrollContainer("scroll-watchlist", "right")}
                title="Scroll Right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="movies-loading-pane flex-center">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: "1rem" }}>Curating custom cinema lists...</p>
          </div>
        ) : (
          <div className="movies-categories-list">
            {categories.map((catId) => {
              const list = moviesByCategory[catId] || [];
              const scrollId = `scroll-${catId}`;
              
              return (
                <div key={catId} className="movie-category-section animate-slide-up">
                  <div className="category-section-header">
                    <h3 className={`category-section-title text-${catId}`}>
                      {getCategoryTitle(catId)}
                    </h3>
                    <span className="count-badge">{list.length} Movies</span>
                  </div>

                  {list.length === 0 ? (
                    <p className="no-movies-text">No recommendations found for this genre.</p>
                  ) : (
                    <div className="movie-carousel-container">
                      <button 
                        className="scroll-arrow-btn left" 
                        onClick={() => scrollContainer(scrollId, "left")}
                        title="Scroll Left"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div id={scrollId} className="movie-horizontal-scroll">
                        {list.map((movie) => (
                          <div 
                            key={movie.imdbID} 
                            className="movie-card-wrapper"
                            onClick={() => setSelectedMovieId(movie.imdbID)}
                          >
                            <div className="movie-card-poster">
                              {movie.Poster && movie.Poster !== "N/A" ? (
                                <img src={movie.Poster} alt={movie.Title} className="movie-poster-img" />
                              ) : (
                                <div className="movie-poster-fallback">
                                  <Film size={32} />
                                </div>
                              )}
                              <div className="movie-card-hover-overlay">
                                <div className="play-icon-circle">
                                  <Play size={20} fill="currentColor" />
                                </div>
                                <span>View Info</span>
                              </div>
                            </div>
                            <div className="movie-card-info">
                              <h4 className="movie-card-title" title={movie.Title}>{movie.Title}</h4>
                              <span className="movie-card-year">{movie.Year}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        className="scroll-arrow-btn right" 
                        onClick={() => scrollContainer(scrollId, "right")}
                        title="Scroll Right"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Render detailed movie popup overlay */}
      {selectedMovieId && (
        <MovieModal 
          movieId={selectedMovieId} 
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
};

export default Movies;
