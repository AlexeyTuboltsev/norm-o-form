import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EFormActionType } from "../formReducer";
import * as React from "react";
import cn from "classnames";
import styles from "./Button.module.scss";
import { faCaretUp, faCaretDown, faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

type TButtonAction = { type: EFormActionType }

const ArrayButton: React.FunctionComponent<{ style?: string, id: string, children?: React.ReactNode }> = ({
  style,
  id,
  children
}) => {
  return <button
    id={id}
    className={cn(styles.arrayButtonBase, style)}
  >
    {children}
  </button>
}

export const AddArrayMemberFormButton: React.FunctionComponent<{ id: string }> = ({ id }) =>
  <ArrayButton style={styles.addArrayMemberButton} id={id}>
    <FontAwesomeIcon size={"sm"} icon={faPlus} />
  </ArrayButton>

export const DeleteArrayMemberFormButton: React.FunctionComponent<{ id: string }> = ({ id }) =>
  <ArrayButton id={id}>
    <FontAwesomeIcon size={"sm"} icon={faXmark} />
  </ArrayButton>

export const MoveUpArrayMemberFormButton: React.FunctionComponent<{ id: string }> = ({ id }) =>
  <ArrayButton id={id}>
    <FontAwesomeIcon size={"sm"} icon={faCaretUp} />
  </ArrayButton>

export const MoveDownArrayMemberFormButton: React.FunctionComponent<{ id: string }> = ({ id }) =>
  <ArrayButton id={id}>
    <FontAwesomeIcon size={"sm"} icon={faCaretDown} />
  </ArrayButton>