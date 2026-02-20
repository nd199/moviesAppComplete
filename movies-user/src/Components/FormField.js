import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
  type = 'text',
  placeholder = '',
  className = '',
  ...props
}) => {
  const handleChange = e => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-field-label">
          {label}
          {required && (
            <span className="required-indicator" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <div className="form-field-input-wrapper">
        {icon && <span className="form-field-icon">{icon}</span>}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`form-field-input ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      </div>

      {error && (
        <span
          id={`${name}-error`}
          className="form-field-error"
          role="alert"
          aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default FormField;
