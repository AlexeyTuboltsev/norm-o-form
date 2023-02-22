import { getFormRootId, isPrimitiveValueField } from './utils';
import { TFormData, TFormDataToFormGenerator, TFormFieldData, TFormValidator, TValidatorAndFormData } from './types';

export function validateForm<T extends TFormData>(validator: TFormValidator<T>, formData: T): T {
  const formRootId = getFormRootId(formData);
  return doValidateForm(validator, formRootId, formData);
}

export function validateSelfAndParents<T extends TFormData>(validator: TFormValidator<T>, data: T, id: string): T {
  return iterateToRoot(validateField, id, data, validator,);
}

export function setSelfAndParentsTouched<T extends TFormData>(data: T, id: string): T {
  return iterateToRoot(setFieldTouched, id, data);
}

export function findFirstErrorToShow<T extends TFormData>(data: T, id: string): T {
  return iterateToRoot(findErrorToShow, id, data);
}

//*******//

function doValidateForm<T extends TFormData>(validator: TFormValidator<T>, id: string, formData: T): T {

  const newData = formData[id].children.reduce((acc, childId) => {
    return doValidateForm(validator, childId, acc);
  }, formData);

  const [validatedField, _continueIteration] = validateField(id, newData, validator);
  return {
    ...newData,
    [id]: validatedField,
  };
}

function validateField<T extends TFormData>(id: string, data: T, validator: TFormValidator<T>): [TFormFieldData, boolean] {
  const fieldData = data[id];
  let errors: any[] = [];

  if (isPrimitiveValueField(fieldData) && !fieldData.isRequiredField && fieldData.value.trim() === '') {
    /*don't run validations on optional fields if they are empty*/
    errors = [];
  } else {
    const validations = validator[id]
    for (const validationFn of validations) {
      const validationResult = validationFn(id, data as any);
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

function setFieldTouched<T extends TFormData>(id: string, data: T): [TFormFieldData, boolean] {
  return [
    {
      ...data[id],
      touched: true,
    },
    true,
  ];
}

function findErrorToShow<T extends TFormData>(id: string, data: T): [TFormFieldData, boolean] {
  const fieldData = data[id];
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
  ...args: [fieldTransformatonFn: F, id: string, data: T, ...rest: Omit<Parameters<F>,"id"|"data">]
): any {

  const [fieldTransformatonFn, id, data, ...rest] = args

  const [fieldTransformationResult, continueIteration] = fieldTransformatonFn(id, data, ...rest);

  const newData = {
    ...data,
    [id]: fieldTransformationResult,
  };

  if (continueIteration) {
    const parentId = getParentPath(id);

    return parentId ? iterateToRoot(fieldTransformatonFn, parentId, newData, ...rest) : newData;
  } else {
    return newData;
  }
}

export function getParentPath(id: string) {
  const idAsArray = id.split('.').slice(0, -1);
  return idAsArray.length ? idAsArray.join('.') : null;
}


export function separateFormFunctionsAndData<T extends TFormData>(formGenerator: TFormDataToFormGenerator<T>): {validator: TFormValidator<T>, formData: T} {
  return Object.keys(formGenerator).reduce((acc:TValidatorAndFormData<T>, id:keyof T) => {
    acc.validator[id] = [...formGenerator[id].validations]

    acc.formData[id] = { ...formGenerator[id] } as any
    delete (acc.formData[id] as any).validations

    return acc
  },{
    validator: {},
    formData: {}
  } as  TValidatorAndFormData<T>)
}