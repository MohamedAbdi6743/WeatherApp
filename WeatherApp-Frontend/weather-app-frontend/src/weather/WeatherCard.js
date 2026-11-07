import React from "react";
import { FiStar, FiDroplet, FiWind, FiActivity, FiEye } from "react-icons/fi";
import { conditionIcon, formatNumber, formatTemp, formatTime } from "./format";

const Stat = ({ icon: Icon, label, value, unit }) => (
  <div className="px-4 py-3.5">
    <dt className="flex items-center gap-1.5 text-[13px] text-ink-muted">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </dt>
    <dd className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-ink">
      {value}
      {value !== "–" && <span className="ml-0.5 text-sm font-normal text-ink-muted">{unit}</span>}
    </dd>
  </div>
);

/**
 * The product's main surface. Used on the home page and as the live preview on auth pages.
 * Shell: rounded-card (20) + p-card-inset (8) -> stats panel rounded-item (12).
 */
const WeatherCard = ({ weather, isFavourite, onToggleFavourite, favouriteBusy }) => {
  const Condition = conditionIcon(weather.weatherStatusId, weather.icon);
  const updated = formatTime(weather.updatedOn);

  return (
    <article className="animate-fade-up rounded-card border border-line bg-surface p-card-inset shadow-[0_1px_2px_rgba(24,24,27,0.04),0_12px_32px_-16px_rgba(24,24,27,0.18)]">
      <div className="px-4 pb-7 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="flex items-baseline gap-2 text-2xl font-semibold tracking-tight text-ink">
              <span className="truncate">{weather.city?.name}</span>
              <span className="font-mono text-[13px] font-medium text-ink-subtle">
                {weather.city?.country?.countryCode}
              </span>
            </h2>
            <p className="mt-1 flex items-center gap-1.5 capitalize text-ink-muted">
              <Condition className="h-4 w-4" aria-hidden="true" />
              {weather.description}
            </p>
          </div>

          {onToggleFavourite && (
            <button
              type="button"
              onClick={onToggleFavourite}
              disabled={favouriteBusy}
              aria-pressed={Boolean(isFavourite)}
              aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
              title={isFavourite ? "Remove from favourites" : "Add to favourites"}
              className={[
                // -mr/-mt: align the star's visual edge with the card text, not its hit area
                "-mr-2 -mt-1.5 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring disabled:cursor-wait",
                isFavourite ? "text-accent hover:bg-accent-soft" : "text-ink-muted hover:bg-canvas hover:text-ink",
              ].join(" ")}
            >
              <FiStar
                key={String(Boolean(isFavourite))}
                className={["h-[22px] w-[22px]", isFavourite ? "animate-pop fill-current" : ""].join(" ")}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <p className="mt-8 flex items-start font-semibold leading-[0.8] tracking-[-0.045em] text-ink tabular-nums">
          {/* -ml: pull the digit's side bearing back so it lines up with the city name */}
          <span className="-ml-[0.055em] text-[96px] sm:text-[112px]">{formatTemp(weather.temp)}</span>
          <span className="ml-1 mt-[0.15em] text-[32px] font-medium tracking-normal text-ink-subtle sm:text-[36px]">
            °C
          </span>
        </p>
        <p className="mt-5 text-[15px] tabular-nums text-ink-muted">
          Feels like {formatTemp(weather.feelsLike)}° · High {formatTemp(weather.tempMax)}° · Low{" "}
          {formatTemp(weather.tempMin)}°
        </p>
      </div>

      <dl className="grid grid-cols-2 rounded-item bg-canvas sm:grid-cols-4">
        <Stat icon={FiDroplet} label="Humidity" value={formatNumber(weather.humidity)} unit="%" />
        <Stat icon={FiWind} label="Wind" value={formatNumber(weather.windSpeed, 1)} unit="m/s" />
        <Stat icon={FiActivity} label="Pressure" value={formatNumber(weather.pressure)} unit="hPa" />
        <Stat
          icon={FiEye}
          label="Visibility"
          value={weather.visibility != null ? formatNumber(weather.visibility / 1000, 1) : "–"}
          unit="km"
        />
      </dl>

      {updated && (
        <p className="px-4 pb-1 pt-3 text-xs text-ink-subtle sm:px-6">
          Updated <time className="font-mono">{updated}</time>
        </p>
      )}
    </article>
  );
};

export const WeatherCardSkeleton = () => (
  <div
    className="rounded-card border border-line bg-surface p-card-inset"
    role="status"
    aria-label="Loading weather"
  >
    <div className="animate-pulse px-4 pb-7 pt-4 sm:px-6 sm:pt-6">
      <div className="h-7 w-40 rounded-md bg-canvas" />
      <div className="mt-2 h-4 w-24 rounded-md bg-canvas" />
      <div className="mt-8 h-[88px] w-44 rounded-item bg-canvas" />
      <div className="mt-5 h-4 w-64 max-w-full rounded-md bg-canvas" />
    </div>
    <div className="h-[76px] animate-pulse rounded-item bg-canvas" />
  </div>
);

export default WeatherCard;
