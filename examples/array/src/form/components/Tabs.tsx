import styles from "./Tab.module.scss";
import { Tab } from "./Tab";
import { ETab } from "../formReducer";
import React from "react";

export const Tabs:React.FunctionComponent<{viewTab:ETab}> = ({viewTab}) => {
  return <div className={styles.tabs}>
    <Tab title="form" id={ETab.FORM} isActive={viewTab ===ETab.FORM}/>
    <Tab title="form definition function" id={ETab.FORM_FUNCTION} isActive={viewTab ===ETab.FORM_FUNCTION}/>
    <Tab title="form generator" id={ETab.FORM_GENERATOR} isActive={viewTab ===ETab.FORM_GENERATOR}/>
  </div>
}