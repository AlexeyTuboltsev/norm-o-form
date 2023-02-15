//@ts-nocheck
import { getFormRootId, isPrimitiveValueField } from './utils';
import { TForm, TFormFieldData } from './types';

export function validateForm<T extends TForm>(formData: T): T {
  const formRootId = getFormRootId(formData);
  return doValidateForm(formRootId, formData);
}

export function validateSelfAndParents<T extends TForm>(data: T, id: string): T {
  return iterateToRoot(validateField, id, data);
}

export function setSelfAndParentsTouched<T extends TForm>(data: T, id: string): T {
  return iterateToRoot(setFieldTouched, id, data);
}

export function findFirstErrorToShow<T extends TForm>(data: T, id: string): T {
  return iterateToRoot(findErrorToShow, id, data);
}

//*******//

function doValidateForm<T extends TForm>(id: string, formData: T): T {
  const newData = formData[id].children.reduce((acc, childId) => {
    return doValidateForm(childId, acc);
  }, formData);

  const [validatedField, _continueIteration] = validateField(id, newData);

  return {
    ...newData,
    [id]: validatedField,
  };
}

function validateField<T extends TForm>(id: string, data: T): [TFormFieldData, boolean] {
  const fieldData = data[id];
  let errors:any[] = [];

  if (isPrimitiveValueField(fieldData) && !fieldData.isRequiredField && fieldData.value.trim() === '') {
    /*don't run validations on optional fields if they are empty*/
    errors = [];
  } else {
    for (const validationFn of fieldData.validations) {
      const validationResult = validationFn(id, data);
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

function setFieldTouched<T extends TForm>(id: string, data: T): [TFormFieldData, boolean] {
  return [
    {
      ...data[id],
      touched: true,
    },
    true,
  ];
}

function findErrorToShow<T extends TForm>(id: string, data: T): [TFormFieldData, boolean] {
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

function iterateToRoot<T extends TForm>(
  fieldTransformatonFn: (id: string, data: TForm) => [TFormFieldData, boolean],
  id: string,
  data: T,
):any {
  const [fieldTransformationResult, continueIteration] = fieldTransformatonFn(id, data);

  const newData = {
    ...data,
    [id]: fieldTransformationResult,
  };

  if (continueIteration) {
    const parentId = getParentPath(id);

    return parentId ? iterateToRoot(fieldTransformatonFn, parentId, newData) : newData;
  } else {
    return newData;
  }
}

export function getParentPath(id: string) {
  const idAsArray = id.split('.').slice(0, -1);
  return idAsArray.length ? idAsArray.join('.') : null;
}
