import React from 'react';
import styles from './TextInput.module.scss';

type TTextInputProps = {
  value: string;
  id: string;
  label: string;
  disabled?: boolean;
  isRequiredField: boolean;
  errors: string[];
  showError: boolean;
  touched: boolean;
  style?: { [key: string]: string };
};

export const TextInput: React.FunctionComponent<TTextInputProps> = ({
  id,
  value,
  touched,
  isRequiredField,
  showError,
  label,
  errors,
  disabled = false,
}) => {
  console.log("TextInput",id, value)
  return (
    <div className={styles.formFieldContainer}>
      <label className={value ? styles.labelActive : styles.label}>{`${label}${isRequiredField ? ' *' : ''}`}</label>
      <input
        type="text"
        id={id}
        value={value}
        disabled={disabled}
        onChange={()=>undefined}
      />
      {showError && touched && <div className="error">{errors}</div>}
    </div>
  );
};
