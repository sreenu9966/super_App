import axios from "axios";

// Standard HTTP Configurations
const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

// newsdata.io is used for news because it allows direct localhost requests without CORS blocks
const newsClient = axios.create({
  baseURL: "https://newsdata.io/api/1",
});

const movieClient = axios.create({
  baseURL: "https://www.omdbapi.com/",
});

// ==========================================
// MOCK DATABASES (HIGH FIDELITY FALLBACKS)
// ==========================================

const MOCK_WEATHER = {
  main: {
    temp: 24.5,
    pressure: 1012,
    humidity: 65,
  },
  wind: {
    speed: 4.2,
  },
  weather: [
    {
      description: "scattered clouds",
      icon: "03d",
      main: "Clouds"
    }
  ],
  name: "New York"
};

const MOCK_NEWS = [
  {
    title: "AI Breakthrough: Next-Gen Neural Networks Learn Without Backpropagation",
    description: "Researchers have unveiled a novel optimization method that trains deep learning architectures up to 5 times faster while consuming 60% less energy, paving the way for efficient on-device learning.",
    urlToImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    source: { name: "TechCrunch" },
    publishedAt: "2026-06-26T10:00:00Z"
  },
  {
    title: "Global Clean Energy Generation Reaches Historic 45% Milestone",
    description: "A combination of unprecedented solar deployments, wind expansions, and enhanced grid storage technologies has pushed clean electricity generation past expectations this quarter.",
    urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80",
    source: { name: "Green World" },
    publishedAt: "2026-06-26T09:15:00Z"
  },
  {
    title: "James Webb Space Telescope Captures High-Res Atmospheres of TRAPPIST-1 Exoplanets",
    description: "Astronomers have detected carbon dioxide and water vapor bands in the atmosphere of two rocky planets orbiting the TRAPPIST-1 system, marking a critical step in the search for extraterrestrial life.",
    urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    source: { name: "Nature Cosmos" },
    publishedAt: "2026-06-26T08:30:00Z"
  },
  {
    title: "F1 Championship: Thrilling Last-Lap Overtake Secures Victory in Monaco GP",
    description: "In one of the most unpredictable Monaco Grand Prix events in recent history, a sudden downpour forced emergency pitstops, leading to a dramatic wheel-to-wheel sprint in the final sector.",
    urlToImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
    source: { name: "Motorsport Daily" },
    publishedAt: "2026-06-26T07:45:00Z"
  },
  {
    title: "Acoustic Archeology: How Ancient Amphitheaters Shaped Modern Acoustic Engineering",
    description: "Researchers are modeling sound waves in classical Greek and Roman theaters to develop state-of-the-art concert halls, unlocking sound reflection techniques lost for two millennia.",
    urlToImage: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80",
    source: { name: "Science Journal" },
    publishedAt: "2026-06-26T06:00:00Z"
  }
];

const MOCK_MOVIES = {
  action: [
    { imdbID: "tt0468569", Title: "The Dark Knight", Year: "2008", Poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0371746", Title: "Iron Man", Year: "2008", Poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1375666", Title: "Inception", Year: "2010", Poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0120737", Title: "The Lord of the Rings: The Fellowship of the Ring", Year: "2001", Poster: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt2015381", Title: "Guardians of the Galaxy", Year: "2014", Poster: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=600&auto=format&fit=crop&q=80" }
  ],
  comedy: [
    { imdbID: "tt0405422", Title: "Superbad", Year: "2007", Poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1119646", Title: "The Hangover", Year: "2009", Poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0357413", Title: "Anchorman: The Legend of Ron Burgundy", Year: "2004", Poster: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0110757", Title: "Out of Africa", Year: "1985", Poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0377062", Title: "Mean Girls", Year: "2004", Poster: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=600&auto=format&fit=crop&q=80" }
  ],
  drama: [
    { imdbID: "tt0111161", Title: "The Shawshank Redemption", Year: "1994", Poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0109830", Title: "Forrest Gump", Year: "1994", Poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0068646", Title: "The Godfather", Year: "1972", Poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt6751668", Title: "Parasite", Year: "2019", Poster: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0110413", Title: "Léon: The Professional", Year: "1994", Poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80" }
  ],
  music: [
    { imdbID: "tt7076172", Title: "Bohemian Rhapsody", Year: "2018", Poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt2582802", Title: "Whiplash", Year: "2014", Poster: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt4477584", Title: "La La Land", Year: "2016", Poster: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt5133300", Title: "A Star Is Born", Year: "2018", Poster: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt3993886", Title: "Rocketman", Year: "2019", Poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80" }
  ],
  sports: [
    { imdbID: "tt0075147", Title: "Rocky", Year: "1976", Poster: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1596363", Title: "Moneyball", Year: "2011", Poster: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt3893458", Title: "Ford v Ferrari", Year: "2019", Poster: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1964418", Title: "Creed", Year: "2015", Poster: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1095203", Title: "Rush", Year: "2013", Poster: "https://images.unsplash.com/photo-1610969514088-3484f3e3e070?w=600&auto=format&fit=crop&q=80" }
  ],
  thriller: [
    { imdbID: "tt0114369", Title: "Se7en", Year: "1995", Poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1130884", Title: "Shutter Island", Year: "2010", Poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0102926", Title: "The Silence of the Lambs", Year: "1991", Poster: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt2267998", Title: "Gone Girl", Year: "2014", Poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0816692", Title: "Interstellar", Year: "2014", Poster: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&auto=format&fit=crop&q=80" }
  ],
  fantasy: [
    { imdbID: "tt0120737", Title: "LOTR: The Fellowship of the Ring", Year: "2001", Poster: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0241527", Title: "Harry Potter and the Sorcerer's Stone", Year: "2001", Poster: "https://images.unsplash.com/photo-1598153346810-860daa814c4b?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0903624", Title: "Avatar", Year: "2009", Poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0435651", Title: "The Chronicles of Narnia", Year: "2005", Poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1477834", Title: "Thor: Ragnarok", Year: "2017", Poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80" }
  ],
  romance: [
    { imdbID: "tt0332280", Title: "The Notebook", Year: "2004", Poster: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0120338", Title: "Titanic", Year: "1997", Poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt0414387", Title: "Pride & Prejudice", Year: "2005", Poster: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt1745960", Title: "About Time", Year: "2013", Poster: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80" },
    { imdbID: "tt2298330", Title: "The Fault in Our Stars", Year: "2014", Poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80" }
  ]
};

const MOCK_MOVIE_DETAILS = {
  "tt0468569": {
    imdbID: "tt0468569",
    Title: "The Dark Knight",
    Year: "2008",
    Genre: "Action, Crime, Drama",
    imdbRating: "9.0",
    Runtime: "152 min",
    Plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    Actors: "Christian Bale, Heath Ledger, Aaron Eckhart",
    Director: "Christopher Nolan",
    Released: "18 Jul 2008"
  },
  "tt0111161": {
    imdbID: "tt0111161",
    Title: "The Shawshank Redemption",
    Year: "1994",
    Genre: "Drama",
    imdbRating: "9.3",
    Runtime: "142 min",
    Plot: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    Actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
    Director: "Frank Darabont",
    Released: "14 Oct 1994"
  },
  "tt7076172": {
    imdbID: "tt7076172",
    Title: "Bohemian Rhapsody",
    Year: "2018",
    Genre: "Biography, Drama, Music",
    imdbRating: "7.9",
    Runtime: "134 min",
    Plot: "The story of the legendary British rock band Queen and lead singer Freddie Mercury, leading up to their famous performance at Live Aid in 1985.",
    Actors: "Rami Malek, Lucy Boynton, Gwilym Lee",
    Director: "Bryan Singer",
    Released: "02 Nov 2018"
  }
};

// ==========================================
// API IMPLEMENTATIONS WITH FALLBACKS
// ==========================================

export const fetchCurrentWeather = async (city = "New York", apiKey = "") => {
  // If coordinates are available, use them. Otherwise default to city query.
  if (!apiKey) {
    console.warn("Weather API Key not provided. Using high-fidelity mock weather data.");
    return { ...MOCK_WEATHER, name: city };
  }

  try {
    const response = await weatherClient.get(`/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error("Weather service failure, falling back to mock data:", error);
    return { ...MOCK_WEATHER, name: city };
  }
};

export const fetchWeatherByCoords = async (lat, lon, apiKey = "") => {
  if (!apiKey) {
    console.warn("Weather API Key not provided. Using mock weather for coordinates.");
    return MOCK_WEATHER;
  }

  try {
    const response = await weatherClient.get(`/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error("Weather coordinate service failure, falling back:", error);
    return MOCK_WEATHER;
  }
};

export const fetchTopHeadlines = async (category = "general", apiKey = "") => {
  if (!apiKey) {
    console.warn("News API Key not provided. Using mock news database.");
    return MOCK_NEWS;
  }

  try {
    const mappedCat = category === "general" ? "top" : category;
    const response = await newsClient.get(`/latest?apikey=${apiKey}&language=en&category=${mappedCat}`);
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results.map((art) => ({
        title: art.title,
        description: art.description || art.content || "Read full article details via source link.",
        urlToImage: art.image_url || null,
        publishedAt: art.pubDate,
        source: { name: art.source_id ? art.source_id.toUpperCase() : "NEWS" }
      }));
    }
    return MOCK_NEWS;
  } catch (error) {
    console.error("News service failure, falling back to mock:", error);
    return MOCK_NEWS;
  }
};

export const searchMovieByGenre = async (query = "action", apiKey = "") => {
  const normQuery = query.toLowerCase().trim();
  
  if (!apiKey) {
    console.warn(`Movie API Key not provided. Fetching mock movies for category: ${normQuery}`);
    return MOCK_MOVIES[normQuery] || MOCK_MOVIES["action"];
  }

  try {
    const response = await movieClient.get(`/?s=${encodeURIComponent(normQuery)}&type=movie&apikey=${apiKey}`);
    if (response.data && response.data.Search) {
      return response.data.Search;
    }
    // If search is empty or invalid, fallback
    return MOCK_MOVIES[normQuery] || MOCK_MOVIES["action"];
  } catch (error) {
    console.error("Movie service failure, falling back:", error);
    return MOCK_MOVIES[normQuery] || MOCK_MOVIES["action"];
  }
};

export const fetchMovieDetails = async (imdbID, apiKey = "") => {
  if (!apiKey) {
    console.warn(`Movie API Key not provided. Fetching mock details for imdbID: ${imdbID}`);
    // Check if we have explicit mock details
    if (MOCK_MOVIE_DETAILS[imdbID]) {
      return MOCK_MOVIE_DETAILS[imdbID];
    }
    // Generate simple details on the fly from mock movies catalogs
    for (const cat in MOCK_MOVIES) {
      const match = MOCK_MOVIES[cat].find(m => m.imdbID === imdbID);
      if (match) {
        return {
          imdbID: match.imdbID,
          Title: match.Title,
          Year: match.Year,
          Genre: cat.charAt(0).toUpperCase() + cat.slice(1) + ", Drama, Entertainment",
          imdbRating: (7.5 + Math.random() * 2).toFixed(1),
          Runtime: "120 min",
          Plot: `This is a premium, action-packed movie titled '${match.Title}' released in ${match.Year}. It features an immersive storyline and exceptional cinematography.`,
          Actors: "John Doe, Jane Smith, Actor Name",
          Director: "Director Name",
          Released: `15 Jan ${match.Year}`
        };
      }
    }
    return {
      imdbID,
      Title: "Unknown Movie",
      Year: "2026",
      Genre: "Drama",
      imdbRating: "7.0",
      Runtime: "100 min",
      Plot: "No detailed plot available for this mock movie ID. Enter an OMDB API key to search for real live details.",
      Actors: "N/A",
      Director: "N/A",
      Released: "N/A"
    };
  }

  try {
    const response = await movieClient.get(`/?i=${imdbID}&plot=full&apikey=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error("Movie detail query error, falling back:", error);
    // Find in mock
    return MOCK_MOVIE_DETAILS[imdbID] || {
      imdbID,
      Title: "Movie details loading failed",
      Year: "N/A",
      Genre: "N/A",
      imdbRating: "0.0",
      Runtime: "N/A",
      Plot: "An error occurred while fetching details from OMDB API. Please check your internet connection or API Key.",
      Actors: "N/A",
      Director: "N/A",
      Released: "N/A"
    };
  }
};
