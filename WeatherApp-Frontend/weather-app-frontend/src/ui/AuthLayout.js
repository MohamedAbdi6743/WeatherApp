import React from "react";
import { FiStar } from "react-icons/fi";
import Logo from "./Logo";
import WeatherCard from "../weather/WeatherCard";

// Illustrative data so the preview shows the real card, not a screenshot.
const SAMPLE = {
  city: { name: "Lisbon", country: { countryCode: "PT" } },
  description: "clear sky",
  weatherStatusId: 800,
  icon: "01d",
  temp: 22.4,
  feelsLike: 22.1,
  tempMax: 24,
  tempMin: 18,
  humidity: 56,
  windSpeed: 4.1,
  pressure: 1016,
  visibility: 10000,
};

const SAMPLE_FAVOURITES = [
  ["Toronto", "CA", "9"],
  ["Tokyo", "JP", "17"],
  ["Nairobi", "KE", "24"],
];

const ProductPreview = () => (
  <aside className="hidden border-l border-line bg-accent-soft lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-20">
    <div className="mx-auto w-full max-w-[480px]">
      <p className="mb-5 text-sm font-medium text-ink-muted">What you get after signing in</p>
      <div className="pointer-events-none select-none" aria-hidden="true">
        <WeatherCard weather={SAMPLE} isFavourite onToggleFavourite={() => {}} />
        <div className="mt-4 rounded-card border border-line bg-surface p-card-inset">
          <p className="px-3 pb-1 pt-2 text-sm font-semibold text-ink">Favourites</p>
          {SAMPLE_FAVOURITES.map(([name, code, temp]) => (
            <div key={name} className="flex items-center justify-between rounded-item px-3 py-2.5">
              <span className="flex items-center gap-2 text-[15px] text-ink">
                <FiStar className="h-3.5 w-3.5 fill-current text-accent" />
                {name}
                <span className="font-mono text-xs text-ink-subtle">{code}</span>
              </span>
              <span className="text-[15px] tabular-nums text-ink-muted">{temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </aside>
);

/**
 * Shell for login / signup / reset / verify. Form on the left, the actual product on the right.
 */
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
    <div className="flex min-h-screen flex-col px-4 py-6 sm:px-10 sm:py-8">
      <Logo />
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-[400px] animate-fade-up">
          <h1 className="text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[32px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-pretty text-[15px] leading-6 text-ink-muted">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-8 text-sm text-ink-muted">{footer}</p>}
        </div>
      </main>
    </div>
    <ProductPreview />
  </div>
);

export const TextLink = ({ as: Component, className = "", ...props }) => (
  <Component
    className={`rounded-sm font-medium text-accent underline-offset-4 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring ${className}`}
    {...props}
  />
);

export default AuthLayout;
