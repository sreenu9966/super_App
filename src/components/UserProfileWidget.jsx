import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const UserProfileWidget = () => {
  const { user, categories } = useStore();
  const navigate = useNavigate();

  const getCategoryDisplayName = (id) => {
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
    return names[id] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <div className="dashboard-widget profile-widget glass-panel">
      <div className="profile-top-info">
        {/* Profile Avatar graphic */}
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
          </div>
        </div>

        {/* User stats */}
        <div className="profile-text-info">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <h3 className="profile-username">@{user.username}</h3>
          <p className="profile-phone">📱 {user.mobile}</p>
        </div>
      </div>

      {/* Profile onboarding category chips */}
      <div className="profile-categories-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h4 style={{ margin: 0 }}>Curated Interests</h4>
          <button className="btn-edit-interests" onClick={() => navigate("/categories")}>
            Edit
          </button>
        </div>
        
        <div className="profile-category-chips">
          {categories.map((catId) => (
            <span key={catId} className={`profile-chip chip-${catId}`}>
              {getCategoryDisplayName(catId)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileWidget;
