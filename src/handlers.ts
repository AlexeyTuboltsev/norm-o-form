import {
  deriveInitialUiState,
  deriveUiState,
  findFirstErrorToShow,
  setSelfAndParentsTouched,
  validateForm,
  validateSelfAndParents,
} from './core';
import { EFormTypes, TArrayMemberGenerator, TFormData, TFormGenerator } from './types';
import { generateFullPath, generateRandomString, getParentPath, isPrimitiveValueField, removeSubtree } from './utils';

function chooseOneOf(
  formGenerator: TFormGenerator,
  fieldId: string,
  formData: TFormData,
  value: string
): TFormData {
  const formDataWithoutVariantSubtree = removeSubtree(fieldId, formData);

  return deriveUiState(
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

export function handleFormBlur(formGenerator: TFormGenerator, fieldId: string, formData: TFormData): TFormData {
  return findFirstErrorToShow(formGenerator, fieldId, formData);
}

export function insertArrayMember(formGenerator: TFormGenerator, fieldId: string, formData: TFormData, position:number): TFormData {

  const generatorPath = formData[fieldId].lookupPath
  const fieldGenerator = formGenerator[generatorPath]
  if (fieldGenerator.type !== EFormTypes.ARRAY) {
    return formData
  } else {

    const arrayMemberGeneratorPath = fieldGenerator.children[0] //arrayGenerator has only one child
    const memberPath = generateFullPath(generateRandomString(3), fieldId)

    const arrayMemberGenerator = formGenerator[arrayMemberGeneratorPath] as TArrayMemberGenerator

    const newMember = deriveInitialUiState(
      arrayMemberGeneratorPath,
      formGenerator,
      {},
      memberPath,
      arrayMemberGenerator.defaultValue
    )

    const newMemberValidated = validateForm(formGenerator, newMember)

    formData[fieldId].children.splice(position, 0, memberPath)

    return validateSelfAndParents(
      formGenerator,
      fieldId,
      {
      ...formData,
      ...newMemberValidated
    })
  }
}

export function removeArrayMember(formGenerator: TFormGenerator, fieldPath: string, formData: TFormData, ): TFormData{
  const parentPath = getParentPath(fieldPath)

  if(parentPath){
    const updatedFormData = removeSubtree(fieldPath, formData)
    formData[parentPath].children = formData[parentPath].children.filter(childPath => childPath !== fieldPath)

    return validateSelfAndParents(formGenerator, parentPath, updatedFormData)

  } else {
    //todo throw an error in dev environment
    return formData
  }
}


