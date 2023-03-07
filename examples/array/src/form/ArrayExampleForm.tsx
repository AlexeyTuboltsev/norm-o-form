import { FormWrapper } from "./components/FormWrapper";
import { TextInput } from "./components/TextInput";
import React from "react";
import { SelectInput } from "./components/SelectInput";
import styles from "./ArrayExampleForm.module.scss"
import { TArrayExampleForm } from "./formDataGenerator";
import { TArrayMemberData, TFormFieldData } from "norm-o-form/types";
import { CancelFormButton, SubmitFormButton } from "./components/Button";
import { formDataToButtonState, TTextFieldData } from "norm-o-form";

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

export const ArrayExampleForm: React.FunctionComponent<TFormWrapperProps<TArrayExampleForm>> = ({
  formId,
  formData,
}) => {

  return <FormWrapper
    formId={formId}
  >
    < TextInput
      {...formData["arrayExampleForm.firstName"]}
      label="firstName"
    />
    <TextInput
      {...formData["arrayExampleForm.lastName"]}
      label="lastName"
    />
    <>
      {formData["arrayExampleForm.favoriteArtists"].children.map(arrayMemberPath =>
        <div key={arrayMemberPath}>
          <TextInput
            {...((formData as any)[`${arrayMemberPath}.name`] as TTextFieldData)}
            label="name"
          />
          <TextInput
            {...((formData as any)[`${arrayMemberPath}.album`] as TTextFieldData)}
            label="album"
          />
        </div>
      )
      }
    </>

    <div className={styles.buttonWrapper}>
      <CancelFormButton />
      <SubmitFormButton buttonState={formDataToButtonState(formData["arrayExampleForm"])} />
    </div>
  </FormWrapper>
}
