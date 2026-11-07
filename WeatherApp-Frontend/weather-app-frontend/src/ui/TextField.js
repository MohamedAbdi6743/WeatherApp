import React, { useState } from "react";
import { useField } from "formik";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

/**
 * Formik-bound text input with label, optional hint, inline error and password toggle.
 * Shell: rounded-field (12) + p-field-inset (4) -> inner toggle rounded-field-inner (8).
 */
const TextField = ({
  label,
  labelAction,
  hint,
  mono = false,
  type = "text",
  ...props
}) => {
  const [field, meta] = useField(props);
  const [visible, setVisible] = useState(false);

  const id = props.id || props.name;
  const invalid = Boolean(meta.touched && meta.error);
  const isPassword = type === "password";
  const describedBy = invalid ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {labelAction}
      </div>

      <div
        className={[
          "flex items-center rounded-field border bg-surface p-field-inset transition-[border-color,box-shadow] duration-150",
          invalid
            ? "border-danger ring-2 ring-danger/15"
            : "border-line-strong hover:border-ink-subtle focus-within:!border-accent focus-within:ring-2 focus-within:ring-accent-ring/50",
        ].join(" ")}
      >
        <input
          id={id}
          {...field}
          {...props}
          type={isPassword && visible ? "text" : type}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={[
            "h-9 w-full min-w-0 bg-transparent px-2.5 text-[15px] text-ink outline-none placeholder:text-ink-subtle",
            mono ? "font-mono tracking-tight" : "",
          ].join(" ")}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-field-inner text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
          >
            {visible ? (
              <FiEyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <FiEye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {invalid ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex animate-fade-up gap-1.5 text-[13px] leading-5 text-danger"
        >
          <FiAlertCircle className="mt-[3px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {meta.error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-[13px] leading-5 text-ink-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default TextField;
