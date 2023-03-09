import * as React from "react";
import styles from "../ArrayExampleForm.module.scss";
import {
  DeleteArrayMemberFormButton,
  MoveDownArrayMemberFormButton,
  MoveUpArrayMemberFormButton
} from "./ArrayActions";

export const ArrayMember: React.FunctionComponent<{ className: string, id:string } & { children?: React.ReactNode }> = ({
  children,
  className,
  id
}) => <div className={styles.arrayMember}>
  <div className={styles.arrayMemberInputs}>{children}</div>
  <div className={styles.arrayMemberButtons}>

    <MoveUpArrayMemberFormButton id={id}/>
    <DeleteArrayMemberFormButton id={id}/>
    <MoveDownArrayMemberFormButton id={id}/>

  </div>
</div>
