import React from 'react';
import styles from './FormWrapper.module.scss';
import { EFormUpdateType, formActions, TFormUpdate } from "./formReducer";
import { useDispatch } from "react-redux";
import { TOneOfExampleForm } from "./formDataGenerator";

function noop() {
  return undefined
}

type TFormWrapperProps<T> = {
  formId: string;
  // onChange: (formUpdate: TFormUpdate) => void,
  onFocus?: (id: string, val: string) => void,
  onBlur?: (id: string, val: string) => void,
  onPaste?: (id: string, val: string) => void,
};


export const FormWrapper: React.FunctionComponent<TFormWrapperProps<TOneOfExampleForm>
  & { children?: React.ReactNode }> = ({
  formId,
  children,
  // onChange,
  onBlur,
  onFocus,
  onPaste,
}) => {
  const dispatch = useDispatch()

  return <div
    className={styles.formContainer}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>

      dispatch(formActions.updateForm({
        formId,
        value: event.target.value,
        fieldId: event.target.id,
        updateType: EFormUpdateType.CHANGE
      }))
    }
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
}
