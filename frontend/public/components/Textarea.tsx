import React, { forwardRef, useId, useRef, useEffect } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string | null;
  id?: string;
  className?: string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
};

const baseClasses =
  "block w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", autoResize = true, minRows = 3, ...rest }, forwardedRef) => {
    const generatedId = useId();
    const textareaId = id ?? `textarea-${generatedId}`;
    const errorId = `${textareaId}-error`;
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    // Support forwarded ref
    useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") {
        forwardedRef(innerRef.current);
      } else if (typeof forwardedRef === "object") {
        // @ts-ignore
        forwardedRef.current = innerRef.current;
      }
    }, [forwardedRef]);

    useEffect(() => {
      if (!autoResize || !innerRef.current) return;
      const el = innerRef.current;
      const setHeight = () => {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      };
      // init
      setHeight();
      // adjust on input
      el.addEventListener("input", setHeight);
      return () => el.removeEventListener("input", setHeight);
    }, [autoResize]);

    return (
      <div className="form-control">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={innerRef}
          rows={minRows}
          className={`${baseClasses} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {error ? (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;