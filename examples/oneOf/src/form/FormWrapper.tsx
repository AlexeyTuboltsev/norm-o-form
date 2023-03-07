import React from 'react';
import styles from './FormWrapper.module.scss';
import { EFormUpdateType, formActions, TFormUpdate } from "./formReducer";
import { useDispatch } from "react-redux";
import { TOneOfExampleForm } from "./formDataGenerator";

type TFormWrapperProps<T> = {
  formId: string;
};


export const FormWrapper: React.FunctionComponent<TFormWrapperProps<TOneOfExampleForm>
  & { children?: React.ReactNode }> = ({
  formId,
  children,
}) => {
  const dispatch = useDispatch()
  const action = (value: string, fieldId: string, updateType: EFormUpdateType) =>
    formActions.updateForm({
      formId,
      value,
      fieldId,
      updateType
    })

  return <div
    className={styles.formContainer}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      dispatch(action(event.target.value, event.target.id, EFormUpdateType.CHANGE))
    }}
    onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
      event.stopPropagation();
      dispatch(action(event.target.value, event.target.id, EFormUpdateType.BLUR))
    }}
    onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
      event.stopPropagation();
      dispatch(action(event.target.value, event.target.id, EFormUpdateType.FOCUS))
    }}
    onPaste={(event: React.ClipboardEvent<HTMLInputElement>) => {
      event.stopPropagation();
      dispatch(action(event.currentTarget.value, event.currentTarget.id, EFormUpdateType.PASTE))
    }}
  >
    {children}
  </div>
}
