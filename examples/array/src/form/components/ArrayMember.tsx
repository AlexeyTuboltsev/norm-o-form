import * as React from "react";
import styles from "../ArrayExampleForm.module.scss";
import {
  DeleteArrayMemberFormButton,
  MoveDownArrayMemberFormButton,
  MoveUpArrayMemberFormButton
} from "./ArrayActions";

export const ArrayMember: React.FunctionComponent<{ className: string, id:string,currentPosition:number, arrayLength:number } & { children?: React.ReactNode }> = ({
  children,
  className,
  id,
  currentPosition,
  arrayLength
}) => <div className={styles.arrayMember}>
  <div className={styles.arrayMemberInputs}>{children}</div>
  <div className={styles.arrayMemberButtons}>

    <MoveUpArrayMemberFormButton id={id} currentPosition={currentPosition} isFirstPosition={currentPosition === 0}/>
    <DeleteArrayMemberFormButton id={id}/>
    <MoveDownArrayMemberFormButton id={id} currentPosition={currentPosition} isLastPosition={currentPosition === arrayLength - 1}/>

  </div>
</div>
