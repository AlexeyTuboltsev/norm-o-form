import { FormWrapper } from "./FormWrapper";
import { TextInput } from "./TextInput";
import React from "react";
import { SelectInput } from "./SelectInput";
import styles from "./OneOfExampleForm.module.scss"
import { EOneOfType, TOneOfExampleForm } from "./formDataGenerator";
import { TFormFieldData } from "norm-o-form/types";

type TFormWrapperProps<T> = {
  formId: string;
  formData: T;
}

const FormError = ({ fieldData, style }: { fieldData: TFormFieldData, style?:string }) => {
  const error = fieldData.errors[0]
  return error
    ? <div className={style}>{error}</div>
    : null
}

export const OneOfExampleForm: React.FunctionComponent<TFormWrapperProps<TOneOfExampleForm>> = ({
  formId,
  formData,
}) =>
  <FormWrapper
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
        {...(formData as any)['oneOfExampleForm.variants.type']}
        label="variant"
      />

      {(formData as any)['oneOfExampleForm.variants.type'].value === EOneOfType.option1 ? (
        <TextInput {...(formData as any)['oneOfExampleForm.variants.zzz']} label="zzz" />
      ) : (
        <>
          <TextInput {...(formData as any)['oneOfExampleForm.variants.xxx1']} label="xxx1" />
          <TextInput {...(formData as any)['oneOfExampleForm.variants.xxx2']} label="xxx2" />
        </>
      )}
    </div>

  </FormWrapper>
