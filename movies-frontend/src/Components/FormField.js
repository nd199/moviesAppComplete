const InputField = ({ label, name, value, onChange, error, required, disabled, icon }) => (
  <div className="input-field">
    <label>{label}{required && <span className="required">*</span>}</label>
    <div className="input-wrapper">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
      />
    </div>
    {error && <span className="error-message">{error}</span>}
  </div>
);

export default InputField;