import React from "react";
import { TFormData } from "norm-o-form";
import styles from "./FormView.module.scss"
import { ArrayExampleForm } from "./ArrayExampleForm";
import { ARRAY_EXAMPLE_FORM_ROOT, ETab } from "../formReducer";
import { CodeTab } from "./CodeTab";

export const FormView: React.FunctionComponent<{ viewTab: ETab, form: TFormData, formGeneratorView: string, formFunctionView: string }>
  = ({ formFunctionView, form, formGeneratorView, viewTab }) => {
  switch (viewTab) {
    case ETab.FORM: {
      return <div className={styles.tabContent}>
        <div className={styles.text}>form</div>
        <ArrayExampleForm formId={ARRAY_EXAMPLE_FORM_ROOT} formData={form} />
      </div>
    }
    case ETab.FORM_FUNCTION:
      return <div className={styles.tabContent}>
        <div className={styles.text}>Form definition function is the starting point of the form. </div>
        <CodeTab code={formFunctionView} />
      </div>
    case ETab.FORM_GENERATOR:
      return <div className={styles.tabContent}>
        <div className={styles.text}>”Form generator” is what a form definition function returns — an object that is kept in memory during the entire form lifecycle. It's a key-value map of ”field generators” that hold functions for generation and validation of each node. Each node keeps a link to its fieldGenerator</div>
        <CodeTab code={formGeneratorView} />
      </div>
  }
}