import React from "react";
import { FiLoader } from "react-icons/fi";

const LoadingIndicator = ({ label = "Loading…" }) => (
  <div className="flex min-h-screen items-center justify-center bg-canvas" role="status">
    <FiLoader className="h-6 w-6 animate-spin text-ink-subtle" aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </div>
);

export default LoadingIndicator;
