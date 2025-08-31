import React, { useId, useMemo, useState } from 'react';

export type InputVariant = 'filled' | 'outlined' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean; // added
  variant?: InputVariant;
  size?: InputSize;
  type?: React.HTMLInputTypeAttribute; // allows password, email, etc.
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  // Optional features
  clearable?: boolean;
  passwordToggle?: boolean; // only applicable when type="password"
  // Theming
  theme?: 'light' | 'dark'; // optional override, otherwise inherits via parent classes
}

// Simple spinner for loading state
const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className ?? ''} viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  className = '',
  name,
  id,
  required,
  autoFocus,
  autoComplete,
  clearable = false,
  passwordToggle = false,
  theme,
}) => {
  const autoId = useId();
  const [internal, setInternal] = useState('');
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value! : internal;

  const [showPassword, setShowPassword] = useState(false);
  const effectiveType = type === 'password' && passwordToggle ? (showPassword ? 'text' : 'password') : type;

  const sizeStyles = useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          input: 'text-sm py-2 px-3',
          label: 'text-xs',
          helper: 'text-xs',
          icon: 'h-4 w-4',
        };
      case 'lg':
        return {
          input: 'text-base py-3 px-4',
          label: 'text-sm',
          helper: 'text-sm',
          icon: 'h-5 w-5',
        };
      case 'md':
      default:
        return {
          input: 'text-sm py-2.5 px-3.5',
          label: 'text-sm',
          helper: 'text-xs',
          icon: 'h-5 w-5',
        };
    }
  }, [size]);

  const baseRing = invalid
    ? 'ring-1 ring-red-500 focus:ring-2 focus:ring-red-500'
    : 'ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 dark:ring-neutral-700 dark:focus:ring-blue-500';

  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'filled':
        return `bg-gray-50 dark:bg-neutral-800 ${baseRing}`;
      case 'ghost':
        return `bg-transparent ${baseRing} ring-0 border border-transparent focus:border-blue-500 dark:focus:border-blue-500`;
      case 'outlined':
      default:
        return `bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 focus:border-blue-500 ${invalid ? 'border-red-500 focus:border-red-500' : ''}`;
    }
  }, [variant, baseRing, invalid]);

  const textColors = 'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500';
  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : '';
  const wrapperTheme = theme === 'light' ? 'bg-white text-gray-900' : theme === 'dark' ? 'dark bg-neutral-950 text-gray-100' : '';

  const showError = !!errorMessage && (invalid || !!errorMessage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e);
  };

  const clearEnabled = clearable && !disabled && !loading && inputValue?.length;

  const inputId = id ?? autoId;

  return (
    <div className={`flex flex-col gap-1 ${wrapperTheme} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={`font-medium text-gray-700 dark:text-gray-300 ${sizeStyles.label}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`relative inline-flex w-full items-center rounded-md transition-colors ${sizeStyles.input} ${variantStyles} ${textColors} ${disabledStyles}`}
      >
        <input
          id={inputId}
          name={name}
          type={effectiveType}
          className={`peer w-full bg-transparent outline-none placeholder:select-none ${
            size === 'lg' ? 'pr-12' : 'pr-10'
          }`}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || !!errorMessage}
          aria-busy={loading}
          required={required}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
        />

        {/* Right-side controls */}
        <div className="absolute right-2 flex items-center gap-1">
          {loading && <Spinner className={`animate-spin ${sizeStyles.icon}`} />}

          {type === 'password' && passwordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
              disabled={disabled}
            >
              {showPassword ? (
                // Eye-off icon
                <svg className={sizeStyles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3.11-11-8 1.02-2.77 2.92-5.02 5.3-6.48" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12" />
                </svg>
              ) : (
                // Eye icon
                <svg className={sizeStyles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}

          {clearEnabled ? (
            <button
              type="button"
              onClick={() => {
                if (!isControlled) setInternal('');
                // Notify consumer with empty string
                onChange?.({
                  target: { value: '' },
                } as unknown as React.ChangeEvent<HTMLInputElement>);
              }}
              className="rounded p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Clear input"
              tabIndex={-1}
            >
              <svg className={sizeStyles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {showError ? (
        <p className={`text-red-600 dark:text-red-400 ${sizeStyles.helper}`}>{errorMessage}</p>
      ) : helperText ? (
        <p className={`text-gray-500 dark:text-gray-400 ${sizeStyles.helper}`}>{helperText}</p>
      ) : null}
    </div>
  );
};

export default InputField;