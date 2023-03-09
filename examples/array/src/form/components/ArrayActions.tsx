import { EFormActionType } from "../formReducer";
import * as React from "react";
import cn from "classnames";
import styles from "./Button.module.scss";

type TButtonAction = {type: EFormActionType}

const ArrayButton:React.FunctionComponent<{style?:string, label:string, id:string}> = ({style, id,label}) => {
  return <button
    id={id}
    className={cn(styles.arrayButtonBase,style)}
  >    {label}
  </button>
}

export const AddArrayMemberFormButton:React.FunctionComponent<{id:string}> = ({id}) =>
  <ArrayButton
    style={styles.addArrayMemberButton}
    id={id}
    label="+"
  />

export const DeleteArrayMemberFormButton:React.FunctionComponent<{id:string}> = ({id}) =>
  <ArrayButton label="X" id={id} />

export const MoveUpArrayMemberFormButton:React.FunctionComponent<{id:string}> = ({id}) =>
  <ArrayButton label="^" id={id} />
export const MoveDownArrayMemberFormButton:React.FunctionComponent<{id:string}> = ({id}) =>
  <ArrayButton label="v" id={id} />