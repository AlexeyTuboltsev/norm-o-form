import {
  filter,
  generateFullPath,
  generateRandomString,
  getFormRootId,
  isPrimitiveValueField,
  mapParentTree
} from './utils';
import {
  EFormTypes,
  TArrayGenerator, TArrayMemberGenerator,
  TFormData,
  TFormFieldData,
  TFormFieldGenerator,
  TFormGenerator,
  TNumericFieldData,
  TSelectFieldData,
  TTextFieldData
} from './types';


type TDeriveUiStateArgs = [formGenerator: TFormGenerator, initialFormData: TFormData, path: string, value: any]

export function deriveInitialUiState(lookupPath: string, ...args: TDeriveUiStateArgs): TFormData {
  const [formGenerator] = args
  const fieldGenerator = formGenerator[lookupPath]

  switch (fieldGenerator.type) {
    case EFormTypes.ARRAY:
      return deriveArrayUiState(deriveInitialUiState, fieldGenerator, ...args)

    case EFormTypes.ARRAY_MEMBER:
      return deriveArrayMemberUiState(deriveInitialUiState, fieldGenerator, ...args)

    default:
      return doDeriveUiInitialState(deriveInitialUiState, fieldGenerator, ...args)
  }
}

export function deriveUiState(lookupPath: string, ...args: TDeriveUiStateArgs): TFormData {
  const [formGenerator] = args
  const fieldGenerator = formGenerator[lookupPath]

  switch (fieldGenerator.type) {
    case EFormTypes.ARRAY:
      return deriveArrayUiState(deriveUiState, fieldGenerator, ...args)

    case EFormTypes.ARRAY_MEMBER:
      return deriveArrayMemberUiState(deriveUiState, fieldGenerator, ...args)

    default:
      return doDeriveUiState(deriveUiState, fieldGenerator, ...args)
  }
}


export function generateForm(formGenerator: TFormGenerator, initialValues: any): TFormData {
  const rootId = getFormRootId(formGenerator)
  const uiState = deriveInitialUiState(rootId, formGenerator, {}, rootId, initialValues)
  console.log("generateForm", formGenerator, uiState)
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
  const removeAllShowErrorFlags = mapParentTree(removeShowErrorFlag, formGenerator, id, formData);
  return mapParentTree(findErrorToShow, formGenerator, id, removeAllShowErrorFlags);
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

function removeShowErrorFlag<T extends TFormData>(_formGenerator: TFormGenerator, id: string, formData: T): [TFormFieldData, boolean] {
  const fieldData = formData[id];
  const showError = false;
  return [
    {
      ...fieldData,
      showError,
    },
    true
  ];
}

function deriveArrayUiState(
  derive: any,
  fieldGenerator: TArrayGenerator,
  formGenerator: TFormGenerator,
  initialFormData: TFormData,
  path: string,
  value: any
) {

  const keyedMemberValues: Map<string, any> = fieldGenerator.getValue(value).reduce(<T>(acc: Map<string, any>, memberValue: T) => {
    const randomMemberId = generateFullPath(generateRandomString(3), path)
    return acc.set(randomMemberId, memberValue)
  }, new Map())

  const arrayMemberGeneratorPath = fieldGenerator.children[0] //array always has one child - arrayMember

  initialFormData[path] = generateFieldData(fieldGenerator,value,path,Array.from(keyedMemberValues.keys()))

  return Array.from(keyedMemberValues.keys()).reduce((_acc: any, childPath: string) => {
    return derive(arrayMemberGeneratorPath, formGenerator, initialFormData, childPath, keyedMemberValues.get(childPath))
  }, initialFormData)
}

function deriveArrayMemberUiState(
  derive: any,
  fieldGenerator: TArrayMemberGenerator,
  formGenerator: TFormGenerator,
  initialFormData: TFormData,
  path: string,
  value: any
) {
  const childrenGeneratorPaths = fieldGenerator.children

  const lookupPathToChildPathMap = mapLookupPathToChildPath(formGenerator,path,childrenGeneratorPaths)

  initialFormData[path] = generateFieldData(fieldGenerator,value, path,Array.from(lookupPathToChildPathMap.values()))

  return Array.from(lookupPathToChildPathMap.entries()).reduce((_acc: any, [childGeneratorPath, childPath]: [string, string]) => {
    return derive(childGeneratorPath, formGenerator, initialFormData, childPath, value)
  }, initialFormData)
}

function doDeriveUiInitialState(
  derive: any,
  fieldGenerator: TFormFieldGenerator,
  formGenerator: TFormGenerator,
  initialFormData: TFormData,
  path: string,
  value: any
) {
  const childrenGeneratorPaths: string[] = fieldGenerator.children

  const lookupPathToChildPathMap = mapLookupPathToChildPath(formGenerator,path,childrenGeneratorPaths)

  initialFormData[path] = generateInitialFieldData(fieldGenerator,value,path,Array.from(lookupPathToChildPathMap.values()))

  //TODO create a special oneOf case in parent function
  //in case of oneOf fieldGenerator.generate() returns only a subset of children,
  //so we need to filter the rest out
  const lookupPathToChildPathMapResolved = filter(lookupPathToChildPathMap, ([_k, v]) => initialFormData[path].children.includes(v))

  return Array.from(lookupPathToChildPathMapResolved).reduce((_acc: any, [childGeneratorPath, childPath]: [string, string]) => {
    return derive(childGeneratorPath, formGenerator, initialFormData, childPath, value)
  }, initialFormData)
}

function doDeriveUiState(
  derive: any,
  fieldGenerator: TFormFieldGenerator,
  formGenerator: TFormGenerator,
  initialFormData: TFormData,
  path: string,
  value: any
) {
  const childrenGeneratorPaths: string[] = fieldGenerator.children

  const lookupPathToChildPathMap = mapLookupPathToChildPath(formGenerator,path,childrenGeneratorPaths)

  initialFormData[path] = generateFieldData(fieldGenerator,value,path,Array.from(lookupPathToChildPathMap.values()))

  //TODO write a special oneOf case in parent function
  //in case of oneOf fieldGenerator.generate() returns only a subset of children,
  //so we need to filter the rest out
  const lookupPathToChildPathMapResolved = filter(lookupPathToChildPathMap, ([_k, v]) => initialFormData[path].children.includes(v))

  return Array.from(lookupPathToChildPathMapResolved.entries()).reduce((_acc: any, [childGeneratorPath, childPath]: [string, string]) => {
    return derive(childGeneratorPath, formGenerator, initialFormData, childPath, value)
  }, initialFormData)
}

function mapLookupPathToChildPath(formGenerator:TFormGenerator,path:string,childrenGeneratorPaths:string[]):Map<string, string>{
  return childrenGeneratorPaths.reduce((acc: Map<string, string>, childGeneratorPath: string) => {
    const id = (formGenerator[childGeneratorPath] as any).id
    return acc.set(childGeneratorPath, generateFullPath(id, path))
  }, new Map())
}

function generateInitialFieldData(fieldGenerator:TFormFieldGenerator, value:any, path:string,childrenPaths:string[]) {
  return fieldGenerator.generate({
    value: fieldGenerator.getValue(value),
    path,
    childrenPaths
  })
}

function generateFieldData(fieldGenerator:TFormFieldGenerator, value:any, path:string,childrenPaths:string[]) {
  return fieldGenerator.generate({
    value: value,
    path,
    childrenPaths
  })
}