//@ts-nocheck
import {
  EButtonState,
  EFormTypes,
  TFormData,
  TFormFieldData,
  TIntegerInputData,
  TSelectInputData,
  TTextInputData,
} from './types';

export function formDataToButtonState(formData) {
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
  return rootField;
}

export function getFormRootId<T extends TFormData>(formData: T): string {
  let rootFieldId;
  for (const formFieldId in formData) {
    if (formData[formFieldId].type === EFormTypes.ROOT) {
      rootFieldId = formFieldId;
      break;
    }
  }
  return rootFieldId;
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
