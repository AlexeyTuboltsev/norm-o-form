import { FormWrapper } from "./FormWrapper";
import { TFormReducer, TOneOfExampleForm } from "./formReducer";
import { TextInput } from "./TextInput";
import React from "react";
import { SelectInput } from "./SelectInput";

type TOneOfExampleFormProps<T> = {
  formId: string;
  formData: T;
  submitForm: () => void
}

export const OneOfExampleForm: React.FunctionComponent<TOneOfExampleFormProps<TOneOfExampleForm>> = ({ formId, formData,submitForm }) =>
  <FormWrapper
    formId={formId}
    onChange={()=>undefined}
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

  </FormWrapper>