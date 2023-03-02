import { FormWrapper } from "./FormWrapper";
import { TextInput } from "./components/TextInput";
import React from "react";
import { SelectInput } from "./components/SelectInput";
import styles from "./OneOfExampleForm.module.scss"
import { EOneOfType, TOneOfExampleForm } from "./formDataGenerator";
import { EButtonState, TFormFieldData } from "norm-o-form/types";
import { CancelFormButton, SubmitFormButton } from "./components/Button";
import { formDataToButtonState } from "norm-o-form";

type TFormWrapperProps<T> = {
  formId: string;
  formData: T;
}

const FormError = ({ fieldData, style }: { fieldData: TFormFieldData, style?: string }) => {
  const error = fieldData.errors[0]
  return error
    ? <div className={style}>{error}</div>
    : null
}

export const OneOfExampleForm: React.FunctionComponent<TFormWrapperProps<TOneOfExampleForm>> = ({
  formId,
  formData,
}) => {

  return <FormWrapper
    formId={formId}
  >
    {/*<FormError fieldData={formData["oneOfExampleForm"]} />*/}
    < TextInput
      {...formData["oneOfExampleForm.appName"]}
      label="appName"
    />
    <SelectInput
      {...formData["oneOfExampleForm.appVersion"]}
      label="appVersion"
    />
    < TextInput
      {...formData["oneOfExampleForm.email"]}
      label="email"
    />
    < TextInput
      {...formData["oneOfExampleForm.deviceId"]}
      label="deviceId"
    />
    <div className={styles.variantContainer}>


      <SelectInput
        {...(formData as any)[`oneOfExampleForm.myVariants.${(formData as any)['oneOfExampleForm.myVariants'].value}.switcher`]}
        label="variant"
      />

      {(formData as any)['oneOfExampleForm.myVariants'].value === EOneOfType.option1
        ? <TextInput {...(formData as any)[`oneOfExampleForm.myVariants.${(formData as any)['oneOfExampleForm.myVariants'].value}.zzz`]}
                   label="zzz" />
        : <>
          <TextInput {...(formData as any)[`oneOfExampleForm.myVariants.${(formData as any)['oneOfExampleForm.myVariants'].value}.xxx1`]}
                     label="xxx1" />
          <TextInput {...(formData as any)[`oneOfExampleForm.myVariants.${(formData as any)['oneOfExampleForm.myVariants'].value}.xxx2`]}
                     label="xxx2" />
        </>
      }
    </div>
    <div className={styles.buttonWrapper}>
      <CancelFormButton />
      <SubmitFormButton buttonState={formDataToButtonState(formData["oneOfExampleForm"])} />
    </div>
  </FormWrapper>
}
