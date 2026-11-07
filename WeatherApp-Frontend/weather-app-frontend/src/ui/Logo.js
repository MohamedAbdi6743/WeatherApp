import React from "react";
import { Link } from "react-router-dom";
import { FiSun } from "react-icons/fi";

const Logo = () => (
  <Link
    to="/"
    className="inline-flex items-center gap-2.5 rounded-field-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
  >
    <span className="grid h-8 w-8 place-items-center rounded-field-inner bg-accent text-white">
      <FiSun className="h-[18px] w-[18px]" aria-hidden="true" />
    </span>
    <span className="text-[15px] font-semibold tracking-tight text-ink">
      Weather App
    </span>
  </Link>
);

export default Logo;
