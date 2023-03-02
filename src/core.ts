import { getFormRootId, isPrimitiveValueField } from './utils';
import {
  TFormData,
  TFormFieldData,
  TFormGenerator, TIntegerInputData,
  TSelectInputData,
  TTextInputData
} from './types';

export function deriveUiState(formGenerator: TFormGenerator) {
  return Object.keys(formGenerator).reduce((acc: TFormData, fieldId) => {
    const field = { ...formGenerator[fieldId] }
    delete (field as any).validations

    if ((field as any).variants) {
      delete (field as any).variants
    }

    acc[fieldId] = field
    return acc
  }, {})
}

export function generateForm(formGenerator: TFormGenerator):TFormData {
  console.log("generateForm",formGenerator)
  return validateForm(
    formGenerator,
    deriveUiState(formGenerator)
  )
}

export function validateForm(formGenerator: TFormGenerator, formData: TFormData): TFormData {
  const formRootId = getFormRootId(formGenerator);
  return doValidateForm(formGenerator, formRootId, formData);
}

export function validateSelfAndParents(formGenerator: TFormGenerator, id: string, formData:TFormData): TFormData {
  return iterateToRoot(validateField, formGenerator, id, formData);
}

export function setSelfAndParentsTouched<T extends TFormData>(formGenerator: TFormGenerator, id: string, formData: T, ): T {
  return iterateToRoot(setFieldTouched, formGenerator, id, formData);
}

export function findFirstErrorToShow(formGenerator: TFormGenerator, id: string,formData: TFormData): TFormData {
  return iterateToRoot(findErrorToShow, formGenerator, id, formData);
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

function iterateToRoot<T extends TFormData, F extends (...args: any[]) => [TFormFieldData, boolean]>(
  ...args: [fieldTransformatonFn: F, fieldGenerator: TFormGenerator, id: string, formData: T]
): any {

  const [fieldTransformatonFn, formGenerator, id, formData] = args

  const [fieldTransformationResult, continueIteration] = fieldTransformatonFn(formGenerator, id, formData);

  const newFormData = {
    ...formData,
    [id]: fieldTransformationResult,
  };

  if (continueIteration) {
    const parentId = getParentPath(id);

    return parentId ? iterateToRoot(fieldTransformatonFn, formGenerator, parentId, newFormData) : newFormData;
  } else {
    return newFormData;
  }
}

export function getParentPath(id: string) {
  const idAsArray = id.split('.').slice(0, -1);
  return idAsArray.length ? idAsArray.join('.') : null;
}

export function getSwitcherPath(id: string) {
  const idAsArray = id.split('.').slice(0, -2);
  return idAsArray.length ? idAsArray.join('.') : null;
}