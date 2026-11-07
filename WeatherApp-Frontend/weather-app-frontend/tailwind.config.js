/** @type {import('tailwindcss').Config} */
const tailwindColors = require("tailwindcss/colors");

// Copy every colour except the old v2 names; reading those prints deprecation warnings.
const deprecated = ["lightBlue", "warmGray", "trueGray", "coolGray", "blueGray"];
const colors = Object.fromEntries(
  Object.keys(tailwindColors)
    .filter((name) => !deprecated.includes(name))
    .map((name) => [name, tailwindColors[name]])
);

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      ...colors,
    },
  },
  plugins: [],
};
