import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { AlertCircle } from "lucide-react";

const AVAILABLE_CATEGORIES = [
  { id: "action", name: "Action", class: "cat-action", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )},
  { id: "comedy", name: "Comedy", class: "cat-comedy", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  )},
  { id: "drama", name: "Drama", class: "cat-drama", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>
      <path d="M8 16.5s1.5-2 4-2 4 2 4 2"/>
      <path d="M9 10h.01M15 10h.01"/>
    </svg>
  )},
  { id: "music", name: "Music", class: "cat-music", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  )},
  { id: "sports", name: "Sports", class: "cat-sports", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <circle cx="12" cy="12" r="10"/>
      <path d="M6.2 6.2C9 7.6 10.4 10.4 12 12c1.6 1.6 4.4 3 5.8 5.8"/>
      <path d="M17.8 6.2C15 7.6 13.6 10.4 12 12c-1.6 1.6-4.4 3-5.8 5.8"/>
    </svg>
  )},
  { id: "thriller", name: "Thriller", class: "cat-thriller", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <path d="M18.6 18.6L22 22M16 11.5c0 2.5-2 4.5-4.5 4.5S7 14 7 11.5 9 7 11.5 7s4.5 2 4.5 4.5z"/>
      <path d="M12 2a10 10 0 0 0-10 10c0 4 3 7 7 8"/>
    </svg>
  )},
  { id: "fantasy", name: "Fantasy", class: "cat-fantasy", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )},
  { id: "romance", name: "Romance", class: "cat-romance", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-image-placeholder">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )}
];

const Categories = () => {
  const { categories, setCategories } = useStore();
  const navigate = useNavigate();

  const handleToggleCategory = (categoryId) => {
    if (categories.includes(categoryId)) {
      setCategories(categories.filter((id) => id !== categoryId));
    } else {
      setCategories([...categories, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setCategories(categories.filter((id) => id !== categoryId));
  };

  const handleContinue = () => {
    if (categories.length >= 3) {
      navigate("/dashboard");
    }
  };

  const isValid = categories.length >= 3;

  return (
    <div className="categories-page-container animate-fade-in">
      <div className="categories-left-panel">
        <div className="categories-brand">Super App</div>
        <div className="categories-left-content">
          <h1>Choose your entertainment categories</h1>
          <p>Select at least 3 categories to curate your personalized dashboard and discover matching movies.</p>
          
          <div className="selected-tags-container">
            {categories.map((id) => {
              const matched = AVAILABLE_CATEGORIES.find((c) => c.id === id);
              if (!matched) return null;
              return (
                <div key={id} className="selected-tag">
                  {matched.name}
                  <button onClick={() => handleRemoveCategory(id)}>×</button>
                </div>
              );
            })}
          </div>

          {!isValid && (
            <div className="categories-alert-box animate-slide-up">
              <AlertCircle size={16} />
              <span>Minimum 3 categories required</span>
            </div>
          )}
        </div>

        <button 
          onClick={handleContinue} 
          disabled={!isValid}
          className={`btn ${isValid ? "btn-accent" : "btn-secondary"} categories-next-btn`}
        >
          Next Page
        </button>
      </div>

      <div className="categories-right-panel">
        <div className="category-grid">
          {AVAILABLE_CATEGORIES.map((cat) => {
            const isSelected = categories.includes(cat.id);
            return (
              <div 
                key={cat.id} 
                onClick={() => handleToggleCategory(cat.id)}
                className={`category-card ${cat.class} ${isSelected ? "selected" : ""}`}
              >
                <div className="category-title">{cat.name}</div>
                {isSelected && (
                  <div className="category-select-tick">✓</div>
                )}
                {cat.icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
