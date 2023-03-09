import { EFormActionType } from "../formReducer";
import * as React from "react";
import cn from "classnames";
import styles from "./Button.module.scss";

type TButtonAction = {type: EFormActionType}

const ArrayButton:React.FunctionComponent<{style?:string, label:string, id:string}> = ({style, id,label}) => {
  return <button
    id={id}
    className={cn(styles.buttonBase,style)}
  >    {label}
  </button>
}

export const AddArrayMemberFormButton:React.FunctionComponent<{id:string}> = ({id}) =>
  <ArrayButton
    id={id}
    label="+"
  />