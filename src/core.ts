import { generateFullPath, generateRandomString, getFormRootId, isPrimitiveValueField, mapParentTree } from './utils';
import {
  EFormTypes,
  TFormData,
  TFormFieldData,
  TFormGenerator,
  TNumericFieldData,
  TSelectFieldData,
  TTextFieldData
} from './types';

export function deriveUiState(formGenerator: TFormGenerator, initialFormData: TFormData, path: string, lookupPath: string, value: any): TFormData {
  const fieldGenerator = formGenerator[lookupPath] as any
  console.log("+++++++++", "lookupPath", lookupPath, "path", path, "fieldGenerator", fieldGenerator, "value", value)

  switch (fieldGenerator.type) {
    case EFormTypes.ARRAY:
      console.log("---deriveUiState array")
      const keyedMemberValues = fieldGenerator.getValue(value).reduce(<T>(acc: { [key: string]: T }, memberValue: T) => {
        const memberId = generateFullPath(generateRandomString(3), path)
        acc[memberId] = memberValue
        return acc
      }, {})

      const arrayMemberGeneratorPath = fieldGenerator.children[0]
      const childrenPaths = Object.keys(keyedMemberValues)

      initialFormData[path] = fieldGenerator.generate({ value, lookupPath, children: childrenPaths })

      return initialFormData[path].children.reduce((_acc: any, childPath: string) => {

        return deriveUiState(formGenerator, initialFormData, childPath, arrayMemberGeneratorPath, keyedMemberValues[childPath])
      }, initialFormData)

    case EFormTypes.ARRAY_MEMBER: {
      console.log("---deriveUiState array member")
      const childrenGeneratorPaths = fieldGenerator.children

      const childrenPaths: { [key: string]: string } = childrenGeneratorPaths.reduce((acc: { [key: string]: string }, childGeneratorPath: string) => {
        const id = (formGenerator[childGeneratorPath] as any).id
        acc[childGeneratorPath] = generateFullPath(id, path)
        return acc
      }, {})

      initialFormData[path] = fieldGenerator.generate({ value, path, childrenPaths: Object.values(childrenPaths) })

      return Object.entries(childrenPaths).reduce((_acc: any, [childGeneratorPath, childPath]: [string, string]) => {

        return deriveUiState(formGenerator, initialFormData, childPath, childGeneratorPath, value)
      }, initialFormData)
    }

    default: {
      console.log("---deriveUiState default")
      const childrenGeneratorPaths = fieldGenerator.children

      const childrenPaths = childrenGeneratorPaths.map((childrenGeneratorPath: string) => {
        const id = (formGenerator[childrenGeneratorPath] as any).id
        return generateFullPath(id, path)

      })
      initialFormData[path] = fieldGenerator.generate({
        value: fieldGenerator.getValue(value),
        lookupPath,
        childrenPaths
      })

      return initialFormData[path].children.reduce((_acc: any, childPath: string) => {
        console.log("formGenerator[childPath]", childPath, formGenerator[childPath])
        return deriveUiState(formGenerator, initialFormData, childPath, childPath, value)
      }, initialFormData)
    }
  }
}

export function generateForm(formGenerator: TFormGenerator, initialValues: any): TFormData {
  const rootId = getFormRootId(formGenerator)
  const uiState = deriveUiState(formGenerator, {}, rootId, rootId, initialValues)
  console.log("generateForm", uiState)
  return validateForm(
    formGenerator,
    uiState
  )
}

export function validateForm(formGenerator: TFormGenerator, formData: TFormData): TFormData {
  const formRootId = getFormRootId(formGenerator);
  return doValidateForm(formGenerator, formRootId, formData);
}

export function validateSelfAndParents(formGenerator: TFormGenerator, id: string, formData: TFormData): TFormData {
  return mapParentTree(validateField, formGenerator, id, formData);
}

export function setSelfAndParentsTouched(formGenerator: TFormGenerator, id: string, formData: TFormData,): TFormData {
  return mapParentTree(setFieldTouched, formGenerator, id, formData);
}

export function findFirstErrorToShow(formGenerator: TFormGenerator, id: string, formData: TFormData): TFormData {
  return mapParentTree(findErrorToShow, formGenerator, id, formData);
}

//*******//

function doValidateForm(formGenerator: TFormGenerator, id: string, formData: TFormData): TFormData {

  const newData = formData[id].children.reduce((acc, childId) => {
    return doValidateForm(formGenerator, childId, acc);
  }, formData);

  const [validatedField, _continueIteration] = validateField(formGenerator, id, newData);
  return {
    ...newData,
    [id]: validatedField,
  };
}

function fieldIsEmpty(fieldData: TTextFieldData | TSelectFieldData | TNumericFieldData) {
  //todo add other primitive field types
  return fieldData.value.trim() === ''
}

function validateField(formGenerator: TFormGenerator, id: string, formData: TFormData): [TFormFieldData, boolean] {

  const fieldData = formData[id];
  let errors: any[] = [];

  if (isPrimitiveValueField(fieldData) && !fieldData.isRequiredField && fieldIsEmpty(fieldData)) {
    /*don't run validations on optional fields if they are empty*/
    errors = [];
  } else {
    const validations = formGenerator[fieldData.lookupPath].validations
    for (const validationFn of validations) {
      const validationResult = validationFn(id, formData);
      if (validationResult) {
        errors = [validationResult];
        break;
      }
    }
  }

  return [
    {
      ...fieldData,
      errors,
    },
    true,
  ];
}

function setFieldTouched<T extends TFormData>(_formGenerator: TFormGenerator, id: string, formData: T): [TFormFieldData, boolean] {
  return [
    {
      ...formData[id],
      touched: true,
    },
    true,
  ];
}

function findErrorToShow<T extends TFormData>(_formGenerator: TFormGenerator, id: string, formData: T): [TFormFieldData, boolean] {
  const fieldData = formData[id];
  const showError = Boolean(fieldData.errors.length) && fieldData.touched;
  return [
    {
      ...fieldData,
      showError,
    },
    !Boolean(fieldData.errors.length) && fieldData.touched,
  ];
}

