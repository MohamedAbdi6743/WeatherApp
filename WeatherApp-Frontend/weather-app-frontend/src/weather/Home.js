import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineSearch, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

import { AppContext } from "../Context/applicationContext";
import {
  getWeatherApi,
  getWeathersApi,
  getFavouriteCitiesApi,
  addFavouriteCityApi,
  deleteFavouriteCityApi,
} from "../util/ApiUtil";

const round = (n) => (n === null || n === undefined ? "–" : Math.round(n));

const Stat = ({ label, value }) => (
  <div className="bg-purple-50 rounded-lg p-3 text-center">
    <div className="text-xs text-purple-500 uppercase tracking-wide">{label}</div>
    <div className="text-lg font-semibold text-purple-900">{value}</div>
  </div>
);

const Home = () => {
  const { getSession, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const session = getSession();
  const token = session?.token;

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [maxFavourites, setMaxFavourites] = useState(0);
  const [recent, setRecent] = useState([]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  // Returns the payload on success; shows the error (or logs out on an expired token) otherwise.
  const handle = useCallback(
    (res) => {
      if (res.status === 1) return res.payLoad;
      if (res.status === -1) {
        toast("Your session has expired. Please log in again.");
        handleLogout();
      } else {
        toast(res.payLoad);
      }
      return null;
    },
    [handleLogout]
  );

  const loadFavourites = useCallback(async () => {
    const data = handle(await getFavouriteCitiesApi(token));
    if (data) {
      setFavourites(data.favouriteCities || []);
      setMaxFavourites(data.maxFavouriteCities || 0);
    }
  }, [token, handle]);

  const loadRecent = useCallback(async () => {
    const data = handle(await getWeathersApi(token));
    if (data) {
      // Newest first, one entry per city
      const seen = new Set();
      const list = [...data]
        .sort((a, b) => (b.updatedOn || "").localeCompare(a.updatedOn || ""))
        .filter((w) => {
          const key = w.city?.cityId;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      setRecent(list.slice(0, 6));
    }
  }, [token, handle]);

  useEffect(() => {
    loadFavourites();
    loadRecent();
  }, [loadFavourites, loadRecent]);

  const search = async (name) => {
    const query = (name ?? city).trim();
    if (!query) return;
    setLoading(true);
    const data = handle(await getWeatherApi(token, query));
    setLoading(false);
    if (data) {
      setWeather(data);
      setCity("");
      loadRecent();
    }
  };

  const favouriteFor = (cityId) =>
    favourites.find((f) => f.city?.cityId === cityId);

  const toggleFavourite = async () => {
    const cityId = weather?.city?.cityId;
    if (!cityId) return;
    const existing = favouriteFor(cityId);
    const res = existing
      ? await deleteFavouriteCityApi(token, existing.favouriteCityId)
      : await addFavouriteCityApi(token, cityId);
    if (handle(res) !== null) {
      toast(existing ? "Removed from favourites" : "Added to favourites");
      loadFavourites();
    }
  };

  const removeFavourite = async (fav) => {
    if (handle(await deleteFavouriteCityApi(token, fav.favouriteCityId)) !== null) {
      loadFavourites();
    }
  };

  const isFavourite = weather && favouriteFor(weather.city?.cityId);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="max-w-5xl mx-auto flex items-center justify-between bg-white/90 rounded-xl shadow px-5 py-3">
        <div className="flex items-center gap-3">
          <img
            alt=""
            className="h-10 w-10"
            src="https://cdn-icons-png.flaticon.com/512/4052/4052984.png"
          />
          <h1 className="text-2xl font-bold text-purple-800">Weather app</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-purple-700 hidden sm:inline">
            Hi, <b>{session?.username}</b>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 text-white bg-purple-700 rounded-md hover:bg-purple-600"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-6 grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="flex gap-2 bg-white/90 rounded-xl shadow p-3"
          >
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search a city, e.g. Toronto"
              aria-label="City"
              className="flex-1 min-w-0 border-gray-300 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1 px-4 py-2 text-white bg-purple-700 rounded-md hover:bg-purple-600 disabled:opacity-60"
            >
              {loading ? <ImSpinner8 className="animate-spin" /> : <AiOutlineSearch />}
              Search
            </button>
          </form>

          {weather ? (
            <div className="bg-white/95 rounded-xl shadow p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-purple-900">
                    {weather.city?.name}
                    <span className="text-lg text-purple-500 ml-2">
                      {weather.city?.country?.countryCode}
                    </span>
                  </h2>
                  <p className="capitalize text-gray-600">{weather.description}</p>
                </div>
                <button
                  onClick={toggleFavourite}
                  title={isFavourite ? "Remove from favourites" : "Add to favourites"}
                  className="text-3xl text-yellow-500 hover:scale-110 transition-transform"
                >
                  {isFavourite ? <AiFillStar /> : <AiOutlineStar />}
                </button>
              </div>

              <div className="flex items-center gap-4 my-4">
                {weather.icon && (
                  <img
                    alt={weather.description}
                    className="h-24 w-24"
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  />
                )}
                <div>
                  <div className="text-6xl font-bold text-purple-900">
                    {round(weather.temp)}°C
                  </div>
                  <div className="text-gray-600">
                    Feels like {round(weather.feelsLike)}°C · H {round(weather.tempMax)}° L{" "}
                    {round(weather.tempMin)}°
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Humidity" value={`${round(weather.humidity)}%`} />
                <Stat label="Wind" value={`${round(weather.windSpeed)} m/s`} />
                <Stat label="Pressure" value={`${round(weather.pressure)} hPa`} />
                <Stat
                  label="Visibility"
                  value={
                    weather.visibility != null
                      ? `${(weather.visibility / 1000).toFixed(1)} km`
                      : "–"
                  }
                />
              </div>
              {weather.updatedOn && (
                <p className="text-xs text-gray-500 mt-4">Updated {weather.updatedOn}</p>
              )}
            </div>
          ) : (
            <div className="bg-white/90 rounded-xl shadow p-10 text-center text-purple-700">
              Search for a city to see its current weather.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="bg-white/90 rounded-xl shadow p-4">
            <h3 className="font-bold text-purple-800 mb-2">
              Favourites{" "}
              <span className="text-sm font-normal text-gray-500">
                ({favourites.length}/{maxFavourites})
              </span>
            </h3>
            {favourites.length === 0 ? (
              <p className="text-sm text-gray-500">
                Tap the star on a city to save it here.
              </p>
            ) : (
              <ul className="space-y-1">
                {favourites.map((f) => (
                  <li key={f.favouriteCityId} className="flex items-center justify-between">
                    <button
                      onClick={() => search(f.city?.name)}
                      className="text-left text-purple-700 hover:underline"
                    >
                      {f.city?.name}{" "}
                      <span className="text-xs text-gray-500">
                        {f.city?.country?.countryCode}
                      </span>
                    </button>
                    <button
                      onClick={() => removeFavourite(f)}
                      title="Remove"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white/90 rounded-xl shadow p-4">
            <h3 className="font-bold text-purple-800 mb-2">Recent searches</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-500">No searches yet.</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((w) => (
                  <li key={w.weatherId}>
                    <button
                      onClick={() => search(w.city?.name)}
                      className="w-full flex justify-between text-purple-700 hover:underline"
                    >
                      <span>{w.city?.name}</span>
                      <span className="text-gray-600">{round(w.temp)}°C</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Home;
