import React from "react";
import { FormWrapper } from "./FormWrapper";
import { TextInput } from "./TextInput";
import { SelectInput } from "./SelectInput";
import styles from "./ArrayExampleForm.module.scss"
import { EOneOfType, TArrayExampleForm } from "../formDefinition";
import { TFormFieldData } from "norm-o-form/types";
import { CancelFormButton, SubmitFormButton } from "./Button";
import { formDataToButtonState, TFormData, TTextFieldData } from "norm-o-form";
import { AddArrayMemberFormButton } from "./ArrayActions";
import { ArrayMember } from "./ArrayMember";
import { FormError } from "./FormError";

type TFormWrapperProps<T extends TFormData> = {
  formId: string;
  formData: TFormData;
}


export const ArrayExampleForm: React.FunctionComponent<TFormWrapperProps<TArrayExampleForm>> = ({
  formId,
  formData,
}) => {

  return <FormWrapper
    formId={formId}
  >
    < TextInput
      {...formData["arrayExampleForm.firstName"] as TTextFieldData}
      label="firstName"
    />
    <TextInput
      {...formData["arrayExampleForm.lastName"] as TTextFieldData}
      label="lastName"
    />
    <div className={styles.arrayWrapper}>
      <AddArrayMemberFormButton id='arrayExampleForm.favoriteArtists' />
      <div className={styles.array}>
        {formData["arrayExampleForm.favoriteArtists"].children.map((arrayMemberPath, index) => {
            return <ArrayMember
              key={arrayMemberPath}
              id={arrayMemberPath}
              className={styles.arrayMember}
              arrayLength={formData["arrayExampleForm.favoriteArtists"].children.length}
              currentPosition={index}
            >
              <TextInput
                {...((formData as any)[`${arrayMemberPath}.name`] as TTextFieldData)}
                label="name"
              />
              <TextInput
                {...((formData as any)[`${arrayMemberPath}.album`] as TTextFieldData)}
                label="album"
              />

              <FormError className={styles.arrayMemberError} fieldData={(formData as any)[`${arrayMemberPath}`]} />
            </ArrayMember>
          }
        )}
      </div>
      <FormError className={styles.arrayError} fieldData={formData["arrayExampleForm.favoriteArtists"]} />
    </div>
    <div className={styles.variantContainer}>
      <SelectInput
        {...(formData as any)['arrayExampleForm.myVariants']}
        label="variant"
      />

      {(formData as any)['arrayExampleForm.myVariants'].value === EOneOfType.option1 ? (
        <TextInput {...(formData as any)[`arrayExampleForm.myVariants.${(formData as any)['arrayExampleForm.myVariants'].value}.email`]}
                   label="email" />
      ) : (
        <>
          <TextInput
            {...(formData as any)[`arrayExampleForm.myVariants.${(formData as any)['arrayExampleForm.myVariants'].value}.phone`]}
            label="phone"
          />
          <TextInput
            {...(formData as any)[`arrayExampleForm.myVariants.${(formData as any)['arrayExampleForm.myVariants'].value}.fax`]}
            label="fax"
          />
        </>
      )}
    </div>
    <div className={styles.buttonWrapper}>
      <CancelFormButton />
      <SubmitFormButton buttonState={formDataToButtonState(formData["arrayExampleForm"])} />
    </div>
  </FormWrapper>
}
