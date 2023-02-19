import { FormWrapper } from "./FormWrapper";
import { EFormUpdateType, formActions, TFormUpdate } from "./formReducer";
import { TextInput } from "./TextInput";
import React from "react";
import { SelectInput } from "./SelectInput";
import { connect } from "react-redux";
import styles from "./OneOfExampleForm.module.scss"
import { EOneOfType, TOneOfExampleForm } from "./formDataGenerator";

type TOneOfExampleFormProps<T> = {
  formId: string;
  formData: T;
}

export const OneOfExampleForm: React.FunctionComponent<TOneOfExampleFormProps<TOneOfExampleForm>> = ({
  formId,
  formData,
}) =>
  <FormWrapper
    formId={formId}
  >
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
        <TextInput {...(formData as any)['oneOfExampleForm.variants.zzz']} label="zzz"  />
      ) : (
        <>
          <TextInput {...(formData as any)['oneOfExampleForm.variants.xxx1']} label="xxx1"  />
          <TextInput {...(formData as any)['oneOfExampleForm.variants.xxx2']} label="xxx2"  />
        </>
      )}
    </div>

  </FormWrapper>
