import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiLogOut, FiX, FiCloud, FiLoader } from "react-icons/fi";

import { AppContext } from "../Context/applicationContext";
import {
  getWeatherApi,
  getWeathersApi,
  getFavouriteCitiesApi,
  addFavouriteCityApi,
  deleteFavouriteCityApi,
} from "../util/ApiUtil";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import Panel, { SkeletonRows } from "../ui/Panel";
import notify from "../ui/notify";
import WeatherCard, { WeatherCardSkeleton } from "./WeatherCard";
import { conditionIcon, formatTemp } from "./format";

const SUGGESTIONS = ["Toronto", "London", "Tokyo"];

const EmptyState = ({ onPick, disabled }) => (
  <div className="rounded-card border border-line bg-surface px-6 py-14 text-center">
    <FiCloud className="mx-auto h-8 w-8 text-ink-subtle" aria-hidden="true" />
    <p className="mt-4 font-medium text-ink">No city selected yet</p>
    <p className="mt-1 text-[15px] text-ink-muted">Search above, or start with one of these:</p>
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((name) => (
        <Button key={name} variant="secondary" size="sm" onClick={() => onPick(name)} disabled={disabled}>
          {name}
        </Button>
      ))}
    </div>
  </div>
);

const Home = () => {
  const { getSession, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const session = getSession();
  const token = session?.token;

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [searching, setSearching] = useState(false);
  const [shake, setShake] = useState(false); // brief shake when a search fails

  const [favourites, setFavourites] = useState([]);
  const [maxFavourites, setMaxFavourites] = useState(0);
  const [recent, setRecent] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [favouriteBusy, setFavouriteBusy] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  // Returns the payload on success; shows the error (or logs out on an expired token) otherwise.
  const handle = useCallback(
    (res) => {
      if (res.status === 1) return res.payLoad;
      if (res.status === -1) {
        notify.error("Your session has expired. Please log in again.");
        handleLogout();
      } else {
        notify.error(res.payLoad);
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
    Promise.all([loadFavourites(), loadRecent()]).finally(() => setListsLoading(false));
  }, [loadFavourites, loadRecent]);

  const search = async (name) => {
    const city = (name ?? query).trim();
    if (!city || searching) return;
    setSearching(true);
    const data = handle(await getWeatherApi(token, city));
    setSearching(false);
    if (data) {
      setWeather(data);
      setQuery("");
      loadRecent();
    } else {
      setShake(true);
    }
  };

  const favouriteFor = (cityId) => favourites.find((f) => f.city?.cityId === cityId);

  const toggleFavourite = async () => {
    const cityId = weather?.city?.cityId;
    if (!cityId) return;
    const existing = favouriteFor(cityId);
    setFavouriteBusy(true);
    const res = existing
      ? await deleteFavouriteCityApi(token, existing.favouriteCityId)
      : await addFavouriteCityApi(token, cityId);
    if (handle(res) !== null) {
      await loadFavourites();
      notify.success(
        existing ? `Removed ${weather.city.name} from favourites` : `Saved ${weather.city.name} to favourites`
      );
    }
    setFavouriteBusy(false);
  };

  const removeFavourite = async (fav) => {
    setRemovingId(fav.favouriteCityId);
    if (handle(await deleteFavouriteCityApi(token, fav.favouriteCityId)) !== null) {
      await loadFavourites();
    }
    setRemovingId(null);
  };

  const isFavourite = Boolean(weather && favouriteFor(weather.city?.cityId));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-muted sm:inline">
              Signed in as <span className="font-medium text-ink">{session?.username}</span>
            </span>
            <Button variant="ghost" size="md" icon={FiLogOut} onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          {/* Main feature: search + current conditions */}
          <section aria-labelledby="home-title">
            <h1
              id="home-title"
              className="max-w-[18ch] text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[44px]"
            >
              Live weather for any city, in one search
            </h1>
            <p className="mt-4 max-w-[52ch] text-pretty text-[15px] leading-6 text-ink-muted sm:text-base">
              Conditions come straight from OpenWeather. Star a city to keep it in your favourites.
            </p>

            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                search();
              }}
              className="mt-10"
            >
              <div
                onAnimationEnd={() => setShake(false)}
                className={[
                  "flex items-center rounded-field border border-line-strong bg-surface p-field-inset shadow-sm transition-[border-color,box-shadow]",
                  "focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-ring/50",
                  shake ? "animate-shake" : "",
                ].join(" ")}
              >
                <FiSearch className="ml-3 h-5 w-5 shrink-0 text-ink-subtle" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="City name"
                  placeholder="Toronto, Lisbon, Tokyo…"
                  autoComplete="off"
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-base text-ink outline-none placeholder:text-ink-subtle"
                />
                <Button
                  type="submit"
                  radius="inner"
                  size="md"
                  className="h-11 px-5"
                  loading={searching}
                  disabled={!query.trim()}
                >
                  Search
                </Button>
              </div>
            </form>

            <div className="mt-8" aria-live="polite">
              {searching && !weather ? (
                <WeatherCardSkeleton />
              ) : weather ? (
                <div
                  className={`transition-opacity duration-200 ${searching ? "opacity-50" : ""}`}
                  aria-busy={searching}
                >
                  <WeatherCard
                    key={weather.weatherId}
                    weather={weather}
                    isFavourite={isFavourite}
                    onToggleFavourite={toggleFavourite}
                    favouriteBusy={favouriteBusy}
                  />
                </div>
              ) : (
                <EmptyState onPick={search} disabled={searching} />
              )}
            </div>
          </section>

          <aside className="space-y-6 lg:pt-3">
            <Panel
              title="Favourites"
              meta={!listsLoading && `${favourites.length}/${maxFavourites}`}
              aria-busy={listsLoading}
            >
              {listsLoading ? (
                <SkeletonRows rows={3} />
              ) : favourites.length === 0 ? (
                <p className="px-3 pb-3 pt-1 text-sm text-ink-muted">
                  Star a city to save it here.
                </p>
              ) : (
                <ul>
                  {favourites.map((f) => (
                    <li
                      key={f.favouriteCityId}
                      className={`group flex animate-fade-up items-center rounded-item pr-1 transition-[background-color,opacity] hover:bg-canvas ${
                        removingId === f.favouriteCityId ? "opacity-50" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => search(f.city?.name)}
                        className="flex min-w-0 flex-1 items-baseline gap-2 rounded-item px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
                      >
                        <span className="truncate text-[15px] text-ink">{f.city?.name}</span>
                        <span className="font-mono text-xs text-ink-subtle">
                          {f.city?.country?.countryCode}
                        </span>
                      </button>
                      {/* row radius 12 - pr-1 (4) = 8 */}
                      <button
                        type="button"
                        onClick={() => removeFavourite(f)}
                        disabled={removingId === f.favouriteCityId}
                        aria-label={`Remove ${f.city?.name} from favourites`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-field-inner text-ink-subtle transition hover:bg-line/70 hover:text-danger focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring group-hover:opacity-100 sm:opacity-0"
                      >
                        {removingId === f.favouriteCityId ? (
                          <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <FiX className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Recent searches" aria-busy={listsLoading}>
              {listsLoading ? (
                <SkeletonRows rows={3} />
              ) : recent.length === 0 ? (
                <p className="px-3 pb-3 pt-1 text-sm text-ink-muted">Cities you search appear here.</p>
              ) : (
                <ul>
                  {recent.map((w) => {
                    const Icon = conditionIcon(w.weatherStatusId, w.icon);
                    return (
                      <li key={w.weatherId} className="animate-fade-up">
                        <button
                          type="button"
                          onClick={() => search(w.city?.name)}
                          className="flex w-full items-center gap-3 rounded-item px-3 py-2.5 text-left transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate text-[15px] text-ink">{w.city?.name}</span>
                          <span className="text-[15px] tabular-nums text-ink-muted">{formatTemp(w.temp)}°</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Home;
