import React from 'react';
import styles from './FormWrapper.module.scss';
import { TOneOfExampleForm } from "./formReducer";

function noop() {
  return undefined
}


// type TFormProps = {
//   formData: TForm;
//   submitForm: (formId: string) => void,
//   closeForm: (formId: string) => void,
//   onChange: (id: string, val: string) => void,
//   onFocus?: (id: string, val: string) => void,
//   onBlur?: (id: string, val: string) => void,
//   onPaste?: (id: string, val: string) => void,
// };


// export const OpenFormWrapper: React.FunctionComponent<TFormProps & { children: React.ReactNode }> = ({
//   children,
//   submitForm,
//   closeForm,
//   formData,
// }) => {
//   const submitButtonState = formDataToButtonState(getFormRoot(formData));
//   return (
//     <>
//       <div className={styles.buttonWrapper}>
//         <button
//           disabled={submitButtonState !== EButtonState.ACTIVE}
//           // onClick={submitForm}
//         >
//           submit
//         </button>
//       </div>
//       {children}
//     </>
//   );
// };

type TFormWrapperProps<T> = {
  formId: string;
  onChange: (id: string, val: string) => void,
  onFocus?: (id: string, val: string) => void,
  onBlur?: (id: string, val: string) => void,
  onPaste?: (id: string, val: string) => void,
};

export const FormWrapper: React.FunctionComponent<TFormWrapperProps<TOneOfExampleForm>
  & { children?: React.ReactNode }> = ({
  formId,
  children,
  onChange,
  onBlur,
  onFocus,
  onPaste,
}) => <div
  className={styles.formContainer}
  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onChange(event.currentTarget.id, event.currentTarget.value)
  }}
  onBlur={onBlur ? (event: React.FocusEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onBlur(event.currentTarget.id, event.currentTarget.value)
  } : noop}
  onFocus={onFocus ? (event: React.FocusEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onFocus(event.currentTarget.id, event.currentTarget.value)
  } : noop}
  onPaste={onPaste ? (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onPaste(event.currentTarget.id, event.currentTarget.value)
  } : noop}
>
  {children}
</div>
