import React from 'react';
import styles from "./Tab.module.scss"
import { useDispatch } from "react-redux";
import { ETab, viewActions } from "../formReducer";
import cn from 'classnames'

export const Tab: React.FunctionComponent<{ title: string, id: ETab, isActive:boolean}> = ({
  title,
  id,
  isActive
}) => {
  const dispatch = useDispatch()

  return <div className={cn(styles.tab,isActive ? styles.active : "")} onClick={() => dispatch(viewActions.changeTab({ tabId: id }))} id={id}>
    {title}
  </div>
}