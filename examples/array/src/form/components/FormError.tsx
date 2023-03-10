import { TFormFieldData } from "norm-o-form/types";
import React from "react";
import styles from "./FormError.module.scss"
import cn from 'classnames'

export const FormError = ({ fieldData, className }: { fieldData: TFormFieldData, className?: string }) => {
  const {errors, touched, showError} = fieldData
  const error = errors[0]
  return error && showError && touched
    ? <div className={cn(styles.error,className)}>{error}</div>
    : null
}