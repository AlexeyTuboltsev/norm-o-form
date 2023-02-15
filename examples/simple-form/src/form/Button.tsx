import * as React from 'react'
import { useDispatch } from "react-redux";
import { formActions } from "./formReducer";

export const ToggleFormButton = () => {
  const dispatch = useDispatch()

  return <button
    onClick={() => dispatch(formActions.openForm())}
  >
    open form
  </button>

}