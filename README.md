# The Super App - Personalized Web Dashboard

A premium, multi-feature React application called **The Super App** that consolidates registration, interest-category onboarding, a modular widget dashboard, and an entertainment discovery zone into a single unified space.

Developed using **React (Vite)**, **Zustand** for state management, **Vanilla CSS** for design tokens and styles, and **Lucide React** for modern iconography.

---

## 🚀 Getting Started

Follow these instructions to set up, install, and run the project on your local machine:

### Prerequisites
- Node.js v18.0.0 or higher
- npm or yarn package manager

### Installation
1. Clone this repository (or copy the files into your local directory):
   ```bash
   git clone <repository-url>
   cd super-app
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🛠️ Tech Stack & Architecture

- **Core Library**: React.js 18 (Vite boilerplate for fast builds and hot module replacement)
- **Routing**: React Router DOM v6 (Includes path protection guards)
- **State Management**: Zustand v4 (Lightweight reactive store synchronizing data with browser storage)
- **Styling**: Vanilla CSS (Premium design tokens, dark theme variables, responsive CSS grids, glassmorphism, hardware-accelerated animations)
- **Icons**: Lucide React
- **APIs Integrated**: OpenWeatherMap (Weather), NewsAPI (News Feed), and OMDB API (Movie recommendations)

### Directory Matrix
```
super-app/
├── index.html                   # HTML entry point (references Google Fonts: Outfit & Inter)
├── vite.config.js               # Vite configurations
├── package.json                 # Project dependencies & scripts
├── src/
│   ├── main.jsx                 # React mounting point
│   ├── App.jsx                  # App coordinator and Router wrapper
│   ├── index.css                # Global stylesheet (design tokens, layout grids, scrollbars, animations)
│   ├── store/
│   │   └── useStore.js          # Global Zustand Store (persisted to localStorage)
│   ├── services/
│   │   └── apiServices.js       # Axios HTTP clients and high-fidelity mock databases
│   ├── routes/
│   │   └── AppRoutes.jsx        # Navigation routing & Route protection guards
│   ├── components/
│   │   ├── Header.jsx           # Top navigation bar & API credentials settings console
│   │   ├── UserProfileWidget.jsx# Display registrant profile details & selected category tags
│   │   ├── WeatherWidget.jsx    # Real-time geolocation weather & digital clock
│   │   ├── NewsWidget.jsx       # Rotating headline carousel (hover-pause feature)
│   │   ├── TimerWidget.jsx      # SVG countdown timer with synthesized beeps
│   │   ├── NotesWidget.jsx      # Workspace memo editor with localStorage auto-saving
│   │   └── MovieModal.jsx       # Overlay movie info panel
│   └── pages/
│       ├── Register.jsx         # Validation form and animated split artwork pane
│       ├── Categories.jsx       # Interest onboarding selection (minimum 3 constraint)
│       ├── Dashboard.jsx        # Grid-based productivity layout
│       └── Movies.jsx           # Cinema discovery rows matching onboard categories
```

---

## 🌟 Core Features

### 1. Form Validation & Registration (`/`)
- Multi-field form validating **Name** (alphabetical checks), **Username** (alphanumeric, no whitespace), **Email** (RFC standard regex validation), and **Mobile Number** (strictly 10 numeric digits).
- Checkbox constraint to share registration data.
- Inline, user-friendly errors in real-time. Saves data to the global Zustand store and navigates to onboarding.
- **Route Guard**: Block navigation to any subsequent page if registration is incomplete.

### 2. Interest Category Onboarding (`/categories`)
- Displays a grid of 8 interest categories (Action, Comedy, Drama, Music, Sports, Thriller, Fantasy, Romance).
- Interactive card selection. Selected cards display a green check badge and a glowing outer shadow.
- Real-time tag chips listed on the left panel (removable by clicking "×").
- **Gatekeeping Logic**: The "Next Page" button remains locked, displaying a warning notification, until the user selects **at least 3 categories**.
- **Route Guard**: Block navigation to Dashboard and Movies unless at least 3 categories are stored.

### 3. Responsive productivity Dashboard (`/dashboard`)
Widgets are arranged in a layout-locked CSS Grid that adjusts dynamically for tablet (2 columns) and mobile (1 column) viewport breakpoints:
- **User Profile**: Renders registrant details, a generated initials-avatar, and category chips.
- **Weather Widget**: Prompts browser location coords to query OpenWeatherMap. Renders temperature, relative humidity, pressure, wind speed, condition text, and condition icon. Includes a real-time running clock updating every second.
- **News Feed Widget**: Pulls top headlines and displays title, featured cover image, publisher badge, and description text.
  - **Auto-Rotation**: Advances article index every **2 seconds** using interval timers.
  - **Hover-Pause**: Hovering pauses rotation to let users read, resuming on mouseout.
  - **Cleanup Protection**: Cleans up intervals on component unmount to prevent leaks.
- **Countdown Timer**: 
  - Visual circular countdown ring (SVG dashoffset transitions).
  - Configurable Hours, Minutes, and Seconds steppers.
  - Controls: Play, Pause, Resume, Reset.
  - **Web Audio API Alarm**: Plays a pleasant synthesized warning sequence of B5-D6-E6-G6 beeps upon expiration (requires no external audio files).
- **Notes Widget**: Text editor memo pad which synchronizes inputs with browser `localStorage` in real-time, auto-saving every keystroke.

### 4. Cinema discovery recommendations (`/movies`)
- Compiles movies category-wise based on selected onboard categories.
- Lists recommendations in horizontal scroll tracks.
- **Hover Animations**: Movie cards scale $1.05\times$, add an ambient shadow glow, and render a play overlay.
- **Detailed Modal Popup**: Clicking a card queries detailed metadata (Release Date, Director, Starring, IMDb Rating, Runtime, and Synopsis Plot) and renders it on a glassmorphic overlay. Dismissible by clicking "×" or clicking the dark backdrop.

### 5. Configurable Credentials Settings
- If OpenWeatherMap, NewsAPI, or OMDB API keys are missing, the application **automatically runs in Offline Mock Mode**, populating widgets with rich mock databases to ensure the application is functional right out of the box.
- Clicking the **Gear icon** in the top navigation header toggles a console to configure custom API keys. Saving keys immediately re-queries live endpoints in real-time.
- A **Logout button** in the header resets the global Zustand state and clears browser `localStorage` logs, returning the user to the registration screen.
