import { getFormRootId, isPrimitiveValueField, mapParentTree } from './utils';
import {
  TFormData,
  TFormFieldData,
  TFormGenerator,
  TIntegerInputData,
  TSelectInputData,
  TTextInputData
} from './types';

export function deriveUiState(formGenerator: TFormGenerator, initialFormData:TFormData,fieldId:string, value:any):TFormData {
  const fieldGenerator = formGenerator[fieldId] as any

  initialFormData[fieldId] = fieldGenerator.generate({value })


  return initialFormData[fieldId].children.reduce((_acc:any, childId:string)=>{
    return deriveUiState(formGenerator, initialFormData, childId, (formGenerator[childId] as any).initialValue)
  }, initialFormData)
}

export function generateForm(formGenerator: TFormGenerator): TFormData {
  const rootId = getFormRootId(formGenerator)
  return validateForm(
    formGenerator,
    deriveUiState(formGenerator,{},rootId, undefined)
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

function fieldIsEmpty(fieldData: TTextInputData | TSelectInputData | TIntegerInputData) {
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

