import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EFormUpdateType, formActions } from "../formReducer";
import * as React from "react";
import cn from "classnames";
import styles from "./Button.module.scss";
import { faCaretDown, faCaretUp, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from "react-redux";
import { AnyAction } from "@reduxjs/toolkit";

const ArrayButton: React.FunctionComponent<{ style?: string, id: string, disabled?: boolean, onClick: (event: React.MouseEvent<HTMLElement>) => AnyAction, children?: React.ReactNode }> = ({
  style,
  id,
  onClick,
  children,
  disabled
}) => {
  const dispatch = useDispatch();

  return <button
    disabled={disabled}
    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      dispatch(onClick(event))
    }}
    id={id}
    className={cn(styles.arrayButtonBase, style)}
  >
    {children}
  </button>
}

export const AddArrayMemberFormButton: React.FunctionComponent<{ id: string }> = ({ id }) => {

  return <ArrayButton
    style={styles.addArrayMemberButton} id={id}
    onClick={(event: React.MouseEvent<HTMLElement>) => formActions.updateForm({
      fieldId: (event.target as HTMLElement).id,
      updateType: EFormUpdateType.INSERT_ARRAY_MEMBER,
      position: 0
    })}
  >
    <FontAwesomeIcon size={"sm"} icon={faPlus} />
  </ArrayButton>
}

export const DeleteArrayMemberFormButton: React.FunctionComponent<{ id: string }> = ({ id }) =>
  <ArrayButton
    id={id}
    onClick={(event: React.MouseEvent<HTMLElement>) => formActions.updateForm({
      fieldId: (event.target as HTMLElement).id,
      updateType: EFormUpdateType.REMOVE_ARRAY_MEMBER,
    })}
  >
    <FontAwesomeIcon size={"sm"} icon={faXmark} />
  </ArrayButton>

export const MoveUpArrayMemberFormButton: React.FunctionComponent<{ id: string, currentPosition: number, isFirstPosition:boolean }> = ({
  id,
  currentPosition,
  isFirstPosition
}) =>
  <ArrayButton
    id={id}
    disabled={isFirstPosition}
    onClick={(event: React.MouseEvent<HTMLElement>) => formActions.updateForm({
      fieldId: (event.target as HTMLElement).id,
      updateType: EFormUpdateType.MOVE_ARRAY_MEMBER,
      targetPosition: currentPosition - 1
    })}

  >
    <FontAwesomeIcon size={"sm"} icon={faCaretUp} />
  </ArrayButton>

export const MoveDownArrayMemberFormButton: React.FunctionComponent<{ id: string, currentPosition: number, isLastPosition: boolean }> = ({
  id,
  currentPosition,
  isLastPosition,
}) =>
  <ArrayButton
    id={id}
    disabled={isLastPosition}
    onClick={(event: React.MouseEvent<HTMLElement>) => formActions.updateForm({
      fieldId: (event.target as HTMLElement).id,
      updateType: EFormUpdateType.MOVE_ARRAY_MEMBER,
      targetPosition: currentPosition + 1
    })}
  >
    <FontAwesomeIcon size={"sm"} icon={faCaretDown} />
  </ArrayButton>