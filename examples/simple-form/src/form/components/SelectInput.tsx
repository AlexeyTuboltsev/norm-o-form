import React from 'react';
import styles from './SelectInput.module.scss';

type TSelectInput = {
  id: string;
  value: string | number;
  options: { key: string; label: string }[];
  isRequiredField: boolean;
  label?: string;
  disabled?: boolean;
  errors: string[];
  showError: boolean;
  touched: boolean;
  style?: { [key: string]: string };
};

export const SelectInput: React.FunctionComponent<TSelectInput> = ({
  id,
  value,
  options,
  touched,
  isRequiredField,
  showError,
  label,
  style,
  errors,
  disabled = false,
}) => <div className={styles.formFieldContainer}>
      {label && (
        <label className={value ? styles.labelActive : styles.label}>{`${label}${isRequiredField ? ' *' : ''}`}</label>
      )}

      <select
        className={styles.select}
        id={id}
        disabled={disabled}
        value={value}
        onChange={()=>undefined}
        style={style}
      >
        {options.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      {showError && touched && <div className="error">{errors}</div>}
    </div>
