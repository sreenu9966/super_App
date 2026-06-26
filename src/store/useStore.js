import { create } from "zustand";

export const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("super_app_user")) || {
    name: "",
    username: "",
    email: "",
    mobile: "",
  },
  categories: JSON.parse(localStorage.getItem("super_app_categories")) || [],
  notes: localStorage.getItem("super_app_notes") || "",
  watchlist: JSON.parse(localStorage.getItem("super_app_watchlist")) || [],
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
    
    const defaultKeys = {
      weather: "f224576e2bf9c25b392c2a711d4f6277",
      news: "pub_c0bce5cc291643a29883c19988fa6779",
      movies: "ffce66ec",
    };
    localStorage.setItem("super_app_apikeys", JSON.stringify(defaultKeys));

    set({
      user: { name: "", username: "", email: "", mobile: "" },
      categories: [],
      notes: "",
      watchlist: [],
      activeCity: "New York",
      apiKeys: defaultKeys
    });
  }
}));
