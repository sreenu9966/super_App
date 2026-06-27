import { create } from "zustand";

export const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("super_app_user")) || {
    name: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  },
  registeredUsers: (() => {
    const cached = JSON.parse(localStorage.getItem("super_app_registered_users"));
    if (cached && Array.isArray(cached)) {
      return cached;
    }
    const defaultUsers = [
      {
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        mobile: "9876543210"
      }
    ];
    localStorage.setItem("super_app_registered_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  })(),
  categories: JSON.parse(localStorage.getItem("super_app_categories")) || [],
  notes: localStorage.getItem("super_app_notes") || "",
  watchlist: JSON.parse(localStorage.getItem("super_app_watchlist")) || [],
  recentlyViewed: JSON.parse(localStorage.getItem("super_app_recently_viewed")) || [],
  activeCity: localStorage.getItem("super_app_active_city") || "New York",
  apiKeys: (() => {
    const cached = JSON.parse(localStorage.getItem("super_app_apikeys"));
    if (cached && (cached.weather || cached.news || cached.movies)) {
      return cached;
    }
    const defaultKeys = {
      weather: "f224576e2bf9c25b392c2a711d4f6277",
      news: "pub_c0bce5cc291643a29883c19988fa6779",
      movies: "ffce66ec",
    };
    localStorage.setItem("super_app_apikeys", JSON.stringify(defaultKeys));
    return defaultKeys;
  })(),

  setUser: (userData) => {
    localStorage.setItem("super_app_user", JSON.stringify(userData));
    set({ user: userData });
  },
  
  registerUser: (newUser) => {
    set((state) => {
      if (state.registeredUsers.some((u) => u.username.toLowerCase() === newUser.username.toLowerCase() || u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return state;
      }
      const updated = [...state.registeredUsers, newUser];
      localStorage.setItem("super_app_registered_users", JSON.stringify(updated));
      return { registeredUsers: updated };
    });
  },
  
  setCategories: (categoryArray) => {
    localStorage.setItem("super_app_categories", JSON.stringify(categoryArray));
    set({ categories: categoryArray });
  },
  
  setNotes: (noteText) => {
    localStorage.setItem("super_app_notes", noteText);
    set({ notes: noteText });
  },

  setActiveCity: (city) => {
    localStorage.setItem("super_app_active_city", city);
    set({ activeCity: city });
  },

  addToWatchlist: (movie) => {
    set((state) => {
      if (state.watchlist.some((m) => m.imdbID === movie.imdbID)) {
        return state;
      }
      const updated = [...state.watchlist, movie];
      localStorage.setItem("super_app_watchlist", JSON.stringify(updated));
      return { watchlist: updated };
    });
  },

  removeFromWatchlist: (movieId) => {
    set((state) => {
      const updated = state.watchlist.filter((m) => m.imdbID !== movieId);
      localStorage.setItem("super_app_watchlist", JSON.stringify(updated));
      return { watchlist: updated };
    });
  },

  addToRecentlyViewed: (movie) => {
    set((state) => {
      const filtered = state.recentlyViewed.filter((m) => m.imdbID !== movie.imdbID);
      const updated = [movie, ...filtered].slice(0, 10);
      localStorage.setItem("super_app_recently_viewed", JSON.stringify(updated));
      return { recentlyViewed: updated };
    });
  },

  setApiKeys: (keys) => {
    const updated = typeof keys === 'function' ? keys(set.getState().apiKeys) : keys;
    localStorage.setItem("super_app_apikeys", JSON.stringify(updated));
    set({ apiKeys: updated });
  },
  
  resetStore: () => {
    localStorage.removeItem("super_app_user");
    localStorage.removeItem("super_app_categories");
    localStorage.removeItem("super_app_notes");
    localStorage.removeItem("super_app_watchlist");
    localStorage.removeItem("super_app_active_city");
    localStorage.removeItem("super_app_apikeys");
    localStorage.removeItem("super_app_registered_users");
    localStorage.removeItem("super_app_recently_viewed");
    
    const defaultKeys = {
      weather: "f224576e2bf9c25b392c2a711d4f6277",
      news: "pub_c0bce5cc291643a29883c19988fa6779",
      movies: "ffce66ec",
    };
    localStorage.setItem("super_app_apikeys", JSON.stringify(defaultKeys));

    const defaultUsers = [
      {
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        mobile: "9876543210"
      }
    ];
    localStorage.setItem("super_app_registered_users", JSON.stringify(defaultUsers));

    set({
      user: { name: "", username: "", email: "", password: "", mobile: "" },
      registeredUsers: defaultUsers,
      categories: [],
      notes: "",
      watchlist: [],
      recentlyViewed: [],
      activeCity: "New York",
      apiKeys: defaultKeys
    });
  }
}));
