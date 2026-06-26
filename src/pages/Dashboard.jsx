import React from "react";
import Header from "../components/Header";
import UserProfileWidget from "../components/UserProfileWidget";
import WeatherWidget from "../components/WeatherWidget";
import NotesWidget from "../components/NotesWidget";
import TimerWidget from "../components/TimerWidget";
import NewsWidget from "../components/NewsWidget";

const Dashboard = () => {
  return (
    <div className="dashboard-page-container animate-fade-in">
      <Header />
      
      <main className="dashboard-main-content container">
        <div className="dashboard-grid-layout">
          {/* User Profile widget */}
          <div className="grid-area-profile">
            <UserProfileWidget />
          </div>

          {/* Weather updates widget */}
          <div className="grid-area-weather">
            <WeatherWidget />
          </div>

          {/* Persistent Notes widget */}
          <div className="grid-area-notes">
            <NotesWidget />
          </div>

          {/* Countdown / alarm timer widget */}
          <div className="grid-area-timer">
            <TimerWidget />
          </div>

          {/* Rotating News headlines widget */}
          <div className="grid-area-news">
            <NewsWidget />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
