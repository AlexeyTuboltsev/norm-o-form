import { FormWrapper } from "./FormWrapper";
import { EFormUpdateType, formActions, TFormUpdate, TOneOfExampleForm } from "./formReducer";
import { TextInput } from "./TextInput";
import React from "react";
import { SelectInput } from "./SelectInput";
import { connect } from "react-redux";

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

  </FormWrapper>
