import React, { useEffect, useState, useRef } from "react";
import { useStore } from "../store/useStore";
import { fetchTopHeadlines } from "../services/apiServices";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewsWidget = () => {
  const apiKeys = useStore((state) => state.apiKeys);
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const rotationTimerRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchTopHeadlines("general", apiKeys.news);
        if (active) {
          const validArticles = data.filter((art) => art.title && art.description);
          setArticles(validArticles.length > 0 ? validArticles : data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) setLoading(false);
      }
    };

    loadNews();

    return () => {
      active = false;
    };
  }, [apiKeys.news]);

  useEffect(() => {
    if (loading || articles.length <= 1) return;

    const startRotation = () => {
      rotationTimerRef.current = setInterval(() => {
        if (!isPaused) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
        }
      }, 6000);
    };

    startRotation();

    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
    };
  }, [loading, articles.length, isPaused]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  if (loading) {
    return (
      <div className="dashboard-widget news-widget glass-panel flex-center">
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: "1rem", color: "var(--text-main)" }}>Fetching top headlines...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="dashboard-widget news-widget glass-panel flex-center">
        <p className="error-text">No articles found at this time.</p>
      </div>
    );
  }

  const activeArticle = articles[currentIndex];
  const publishedDate = activeArticle.publishedAt
    ? new Date(activeArticle.publishedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div 
      className="dashboard-widget news-widget glass-panel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="news-image-container">
        {activeArticle.urlToImage ? (
          <img 
            src={activeArticle.urlToImage} 
            alt={activeArticle.title} 
            className="news-featured-image"
          />
        ) : (
          <div className="news-image-fallback">
            <span>Super News</span>
          </div>
        )}
        {activeArticle.source?.name && (
          <span className="news-source-badge">{activeArticle.source.name}</span>
        )}
      </div>

      <div className="news-widget-nav-overlay">
        <button className="news-nav-btn" onClick={handlePrev} title="Previous Article">
          <ChevronLeft size={16} />
        </button>
        <button className="news-nav-btn" onClick={handleNext} title="Next Article">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="news-details-container">
        <div className="news-meta-row">
          <span className="news-published-date">{publishedDate}</span>
          {isPaused && <span className="news-paused-tag">Paused</span>}
        </div>
        <h3 className="news-article-title" title={activeArticle.title}>
          {activeArticle.title}
        </h3>
        <p className="news-article-description">
          {activeArticle.description}
        </p>
      </div>

      <div className="news-carousel-dots">
        {articles.slice(0, 10).map((_, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`carousel-dot ${idx === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsWidget;
