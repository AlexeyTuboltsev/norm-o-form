import * as React from 'react'
import { useDispatch } from "react-redux";
import { formActions } from "./formReducer";
import styles from './Button.module.scss'

export const ToggleFormButton = () => {
  const dispatch = useDispatch()

  return <button
    className={styles.starterButton}
    onClick={() => dispatch(formActions.openForm())}
  >
    open form
  </button>

}