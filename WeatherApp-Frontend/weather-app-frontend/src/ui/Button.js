import React from "react";
import { FiLoader } from "react-icons/fi";

const variants = {
  primary: "bg-accent text-white shadow-sm hover:bg-accent-hover",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-canvas",
  ghost: "text-ink-muted hover:bg-line/60 hover:text-ink",
};

const sizes = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

const radii = {
  field: "rounded-field",
  inner: "rounded-field-inner",
};

/**
 * One button for the whole app.
 * `loading` swaps the icon for a spinner and (optionally) the label for `loadingText`.
 */
const Button = ({
  variant = "primary",
  size = "md",
  radius = "field",
  icon: Icon,
  loading = false,
  loadingText,
  fullWidth = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}) => {
  const classes = [
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-[background-color,color,transform] duration-150 active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
    loading ? "cursor-wait" : "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    radii[radius],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="-ml-0.5 h-4 w-4" aria-hidden="true" />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  );
};

export default Button;
