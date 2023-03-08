import React from 'react';
import styles from './SelectInput.module.scss';

type TSelectInput = {
  path: string;
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
  path,
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
        id={path}
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
 </div>
