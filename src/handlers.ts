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

export function insertArrayMember(formGenerator: TFormGenerator, fieldId: string, formData: TFormData, position: number): TFormData {

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

    const validated = validateSelfAndParents(
      formGenerator,
      fieldId,
      {
        ...formData,
        ...newMemberValidated
      })
    const touched = setSelfAndParentsTouched(formGenerator, fieldId, validated)
    return findFirstErrorToShow(formGenerator,fieldId,touched)
  }
}

export function removeArrayMember(formGenerator: TFormGenerator, fieldPath: string, formData: TFormData,): TFormData {
  const parentPath = getParentPath(fieldPath)

  if (parentPath) {
    const updatedFormData = removeSubtree(fieldPath, formData)
    formData[parentPath].children = formData[parentPath].children.filter(childPath => childPath !== fieldPath)

    const validated = validateSelfAndParents(formGenerator, parentPath, updatedFormData)
    const touched = setSelfAndParentsTouched(formGenerator, parentPath, validated)
    return findFirstErrorToShow(formGenerator, parentPath, touched)

  } else {
    //todo throw an error in dev environment
    return formData
  }
}

export function moveArrayMember(formGenerator: TFormGenerator, fieldPath: string, formData: TFormData, targetPosition: number): TFormData {
  const arrayPath = getParentPath(fieldPath)
  const currentPosition = !!(arrayPath) ? formData[arrayPath].children.indexOf(fieldPath) : undefined

  if (arrayPath
    && (currentPosition !== -1 && currentPosition !== undefined)
    && (currentPosition !== targetPosition)
    && (targetPosition >= 0 && targetPosition <= formData[arrayPath].children.length - 1)
  ) {
    formData[arrayPath].children.splice(currentPosition, 1)
    formData[arrayPath].children.splice(targetPosition, 0, fieldPath)

    const validated = validateSelfAndParents(formGenerator, arrayPath, formData)
    const touched = setSelfAndParentsTouched(formGenerator, arrayPath, validated)

    return findFirstErrorToShow(formGenerator, arrayPath, touched)


  } else {
    //todo throw an error in dev environment
    return formData
  }
}

