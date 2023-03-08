import {
  deriveUiState,
  findFirstErrorToShow,
  setSelfAndParentsTouched, validateForm,
  validateSelfAndParents,
} from './core';
import { EFormTypes, TFormData, TFormGenerator } from './types';
import {  isPrimitiveValueField, removeSubtree } from './utils';

function chooseOneOf(
  formGenerator: TFormGenerator,
  fieldId: string,
  formData: TFormData,
  value: string
): TFormData {
  const formDataWithoutVariantSubtree = removeSubtree(fieldId, formData);

  return  deriveUiState(
    fieldId,//todo lookupPath
    formGenerator,
    formDataWithoutVariantSubtree,
    fieldId,
    value
  )
}


export function handleFormChange(formGenerator: TFormGenerator, id: string, formData: TFormData, value: any): TFormData {

  const fieldData = formData[id];
  if (fieldData.type === EFormTypes.ONE_OF) {
    const updatedFormData = chooseOneOf(formGenerator, id, formData, value) as any
    const validatedFormData = validateForm(formGenerator, updatedFormData)
    return setSelfAndParentsTouched(formGenerator, id, validatedFormData)

  } else if (isPrimitiveValueField(fieldData)) {
    fieldData.value = value;

    return setSelfAndParentsTouched(
      formGenerator,
      id,
      validateSelfAndParents(formGenerator, id, formData),
    )
  } else {
    return formData
  }
}

export function handleFormBlur(formGenerator: TFormGenerator, id: string, formData: TFormData): TFormData {
  return findFirstErrorToShow(formGenerator, id, formData);
}
