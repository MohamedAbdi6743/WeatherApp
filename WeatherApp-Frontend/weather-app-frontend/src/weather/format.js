import {
  FiSun,
  FiMoon,
  FiCloud,
  FiCloudRain,
  FiCloudDrizzle,
  FiCloudSnow,
  FiCloudLightning,
  FiWind,
} from "react-icons/fi";

const MINUS = "−"; // typographic minus, same width as digits

export const formatTemp = (n) => {
  if (n === null || n === undefined) return "–";
  const r = Math.round(n);
  return r < 0 ? `${MINUS}${Math.abs(r)}` : String(r);
};

export const formatNumber = (n, digits = 0) =>
  n === null || n === undefined ? "–" : Number(n).toFixed(digits);

// "2026-11-07 15:01:21" -> "15:01"
export const formatTime = (timestamp) =>
  typeof timestamp === "string" && timestamp.length >= 16 ? timestamp.slice(11, 16) : null;

// Map OpenWeather condition codes onto our single icon set.
export const conditionIcon = (statusId, icon) => {
  if (!statusId) return FiCloud;
  if (statusId < 300) return FiCloudLightning;
  if (statusId < 400) return FiCloudDrizzle;
  if (statusId < 600) return FiCloudRain;
  if (statusId < 700) return FiCloudSnow;
  if (statusId < 800) return FiWind; // mist, haze, fog, dust
  if (statusId === 800) return icon && icon.endsWith("n") ? FiMoon : FiSun;
  return FiCloud;
};
