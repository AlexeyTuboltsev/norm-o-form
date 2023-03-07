import React from 'react';
import styles from './TextInput.module.scss';

type TTextInputProps = {
  value: string;
  path: string;
  label: string;
  disabled?: boolean;
  isRequiredField: boolean;
  errors: string[];
  showError: boolean;
  touched: boolean;
  style?: { [key: string]: string };
};

export const TextInput: React.FunctionComponent<TTextInputProps> = ({
  path,
  value,
  touched,
  isRequiredField,
  showError,
  label,
  errors,
  disabled = false,
}) => {

  return (
    <div className={styles.formFieldContainer}>
      <label className={value ? styles.labelActive : styles.label}>{`${label}${isRequiredField ? ' *' : ''}`}</label>
      <input
        type="text"
        id={path}
        value={value}
        disabled={disabled}
        onChange={()=>undefined}
      />
      {showError && touched && <div className={styles.error}>{errors}</div>}
    </div>
  );
};
