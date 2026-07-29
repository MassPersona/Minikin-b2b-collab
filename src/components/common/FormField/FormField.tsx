import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import './FormField.css';

interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

interface InputFieldProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  as?: 'input';
}

interface TextareaFieldProps
  extends BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  as: 'textarea';
  rows?: number;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps;

export function FormField(props: FormFieldProps) {
  const { id, label, error, hint, required, as, ...rest } = props;
  const hasError = Boolean(error);

  const inputClass = `form-field__input ${hasError ? 'input-error' : ''}`;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required" aria-hidden="true"> *</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          className={`${inputClass} form-field__textarea`}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={hasError}
          rows={(rest as TextareaFieldProps).rows ?? 4}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={inputClass}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={hasError}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="form-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Lightweight wrapper for custom children (e.g. color pickers)
export function FormFieldWrapper({
  id,
  label,
  error,
  hint,
  required,
  children,
}: BaseFieldProps & { children: ReactNode }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="form-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
