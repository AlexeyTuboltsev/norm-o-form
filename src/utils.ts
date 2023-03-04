import {
  EButtonState,
  EFormTypes,
  TFormData,
  TFormFieldData,
  TFormGenerator,
  TIntegerInputData,
  TSelectInputData,
  TTextInputData,
} from './types';

export function formDataToButtonState<T extends TFormFieldData>(formData: T) {
  return formData.errors.length ? EButtonState.DISABLED : EButtonState.ACTIVE;
}

export function getFormRoot<T extends TFormFieldData>(formData: TFormData): T {
  let rootField;
  for (const formFieldId in formData) {
    if (formData[formFieldId].type === EFormTypes.ROOT) {
      rootField = formData[formFieldId];
      break;
    }
  }
  return rootField as T; // TODO, root is guaranteed to be there, fix typings.
}

export function getFormRootId<T extends TFormData>(formData: T): string {
  let rootFieldId;
  for (const formFieldId in formData) {
    if (formData[formFieldId].type === EFormTypes.ROOT) {
      rootFieldId = formFieldId;
      break;
    }
  }
  return rootFieldId as string; // TODO, root is guaranteed to be there, fix typings.
}

export function isPrimitiveValueField(
  fieldData: TFormFieldData,
): fieldData is TTextInputData | TSelectInputData | TIntegerInputData {
  return (
    fieldData.type === EFormTypes.TEXT_INPUT ||
    fieldData.type === EFormTypes.SELECT ||
    fieldData.type === EFormTypes.INTEGER_INPUT
  );
}

export function generateRandomString(length: number) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str = str + charset[Math.floor(Math.random() * charset.length)];
  }
  return str;
}

export function generateGln13CheckDigit(gln13: string) {
  const split = gln13.split('');
  const digitSum = split.reduce((acc, digit, i) => {
    const multiplier = i % 2 === 0 ? 3 : 1;
    const multiplied = parseInt(digit) * multiplier;
    return acc + multiplied;
  }, 0);
  const nearestEqualOfTen = Math.ceil(digitSum / 10) * 10;
  return nearestEqualOfTen - digitSum;
}

export function controlDigitIsValid(gln13: string) {
  const mainPart = gln13.slice(0, 12);
  const lastDigit = gln13.slice(12);

  const controlDigit = generateGln13CheckDigit(mainPart);

  return parseInt(lastDigit) === controlDigit;
}

export function mapParentTree<T extends TFormData, F extends (...args: any[]) => [TFormFieldData, boolean]>(
  fieldTransformationFn: F, formGenerator: TFormGenerator, id: string, formData: T
): TFormData {
  const [fieldTransformationResult, continueIteration] = fieldTransformationFn(formGenerator, id, formData);

  const newFormData = {
    ...formData,
    [id]: fieldTransformationResult,
  };

  if (continueIteration) {
    const parentId = getParentPath(id);

    return parentId ? mapParentTree(fieldTransformationFn, formGenerator, parentId, newFormData) : newFormData;
  } else {
    return newFormData;
  }
}

export function removeSubtree(id: string, formData: TFormData): TFormData {
  console.log(formData, id)
  if (formData[id].children) {
    formData[id].children.reduce((_acc, childId) => {
      return removeSubtree(childId, formData)
    }, formData)
  }

  delete formData[id]

  return formData
}
//
// export function rebuildSubtree<T extends TFormData>(formGenerator: TFormGenerator, id: string, formData: T): TFormData {
//   const subtreeGenerator = formGenerator[id]
//
//   const newFormData = removeSubtree(id, formData)
//

//   return newFormData
//
// }

export function getParentPath(id: string) {
  const idAsArray = id.split('.').slice(0, -1);
  return idAsArray.length ? idAsArray.join('.') : null;
}

export function getSwitcherPath(id: string) {
  const idAsArray = id.split('.').slice(0, -2);
  return idAsArray.length ? idAsArray.join('.') : null;
}