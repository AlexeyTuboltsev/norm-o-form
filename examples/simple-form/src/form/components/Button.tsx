import * as React from 'react'
import { useDispatch } from "react-redux";
import { EFormActionType, formActions } from "../formReducer";
import styles from './Button.module.scss'
import { EButtonState } from "norm-o-form/types";
import { Loader } from "./Loader";
import cn from 'classnames'

type TButtonAction = {type: EFormActionType.OPEN_FORM | EFormActionType.CLOSE_FORM | EFormActionType.SUBMIT_FORM}

function noop(){return}

const Button = ({style, action, label}:{style?:string, action?:() => TButtonAction, label:string}) => {
  const dispatch = useDispatch()

  return <button
    className={cn(styles.buttonBase,style)}
    onClick={action ? () => dispatch(action()) : noop}
  >    {label}
  </button>
}


export const ToggleFormButton = () =>
  <Button
  action={formActions.openForm}
  label="Open Form"
  />

export const CancelFormButton = () =>
  <Button
    action={formActions.closeForm}
    label="Cancel"
  />

export const SubmitFormButton = ({buttonState}:{buttonState:EButtonState}) => {
  const label = "Submit"

  switch (buttonState){
    case EButtonState.ACTIVE:
      return <Button
        action={formActions.submitForm}
        label={label}
      />
    case EButtonState.DISABLED:
      return <Button
        style={styles.buttonDisabled}
        label={label}
      />
    case EButtonState.LOADING:
      return <div className={styles.buttonLoadingWrapper}>
        <Button
          style={styles.buttonLoading}
          label={label}
        />
        <Loader/>
      </div>
  }
}