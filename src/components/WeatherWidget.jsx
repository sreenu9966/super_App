import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { fetchCurrentWeather, fetchWeatherByCoords } from "../services/apiServices";
import { Wind, Droplets, Thermometer, Search, X, MapPin } from "lucide-react";

const WeatherWidget = () => {
  const apiKeys = useStore((state) => state.apiKeys);
  const activeCity = useStore((state) => state.activeCity);
  const setActiveCity = useStore((state) => state.setActiveCity);

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    const loadWeather = async () => {
      setLoading(true);
      
      if (activeCity === "New York" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (!active) return;
            try {
              const { latitude, longitude } = position.coords;
              const data = await fetchWeatherByCoords(latitude, longitude, apiKeys.weather);
              if (active) {
                setWeatherData(data);
                setLoading(false);
              }
            } catch (err) {
              console.error(err);
              fallbackCity();
            }
          },
          (error) => {
            console.warn(error);
            fallbackCity();
          }
        );
      } else {
        fallbackCity();
      }
    };

    const fallbackCity = async () => {
      if (!active) return;
      try {
        const data = await fetchCurrentWeather(activeCity, apiKeys.weather);
        if (active) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) setLoading(false);
      }
    };

    loadWeather();

    return () => {
      active = false;
    };
  }, [apiKeys.weather, activeCity]);

  const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = date.getDate();
    const m = months[date.getMonth()];
    const y = date.getFullYear();
    return `${m} ${d}, ${y}`;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveCity(searchQuery.trim());
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-widget weather-widget glass-panel flex-center">
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: "1rem" }}>Loading climate details...</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="dashboard-widget weather-widget glass-panel flex-center">
        <p className="error-text">Failed to retrieve weather information.</p>
      </div>
    );
  }

  const iconCode = weatherData.weather?.[0]?.icon || "01d";
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const description = weatherData.weather?.[0]?.description || "clear sky";
  const temp = Math.round(weatherData.main?.temp ?? 20);
  const pressure = weatherData.main?.pressure ?? 1013;
  const humidity = weatherData.main?.humidity ?? 60;
  const windSpeed = weatherData.wind?.speed ?? 3.5;

  return (
    <div className="dashboard-widget weather-widget glass-panel">
      <div className="weather-time-header">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="weather-date">{formatDate(time)}</span>
          <span className="weather-time">{formatTime(time)}</span>
        </div>

        <div className="weather-search-container">
          {isSearching ? (
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <input
                type="text"
                className="weather-search-input"
                placeholder="Enter city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" className="weather-search-btn" onClick={() => setIsSearching(false)}>
                <X size={14} />
              </button>
            </form>
          ) : (
            <button className="weather-search-btn" onClick={() => setIsSearching(true)} title="Search City Weather">
              <Search size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="weather-body">
        <div className="weather-icon-section">
          <img src={iconUrl} alt={description} className="weather-condition-icon" />
          <span className="weather-desc">{description}</span>
        </div>

        <div className="weather-vertical-divider"></div>

        <div className="weather-temp-section">
          <span className="weather-temp-val">{temp}°C</span>
          <span 
            className="weather-city-name" 
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}
            onClick={() => setIsSearching(true)}
            title="Click to search another city"
          >
            <MapPin size={12} className="metric-icon" />
            {weatherData.name}
          </span>
        </div>

        <div className="weather-vertical-divider"></div>

        <div className="weather-metrics-section">
          <div className="weather-metric-row">
            <Wind size={16} className="metric-icon" />
            <div className="metric-text-group">
              <span className="metric-label">Wind</span>
              <span className="metric-val">{windSpeed} m/s</span>
            </div>
          </div>
          <div className="weather-metric-row">
            <Droplets size={16} className="metric-icon" />
            <div className="metric-text-group">
              <span className="metric-label">Humidity</span>
              <span className="metric-val">{humidity}%</span>
            </div>
          </div>
          <div className="weather-metric-row">
            <Thermometer size={16} className="metric-icon" />
            <div className="metric-text-group">
              <span className="metric-label">Pressure</span>
              <span className="metric-val">{pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
