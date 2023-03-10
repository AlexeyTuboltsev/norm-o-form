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
        <div>form</div>
        <ArrayExampleForm formId={ARRAY_EXAMPLE_FORM_ROOT} formData={form} />
      </div>
    }
    case ETab.FORM_FUNCTION:
      return <div className={styles.tabContent}>
        <div>form definition function</div>
        <CodeTab code={formFunctionView} />
      </div>
    case ETab.FORM_GENERATOR:
      return <div className={styles.tabContent}>
        <div>form generator</div>
        <CodeTab code={formGeneratorView} />
      </div>
  }
}