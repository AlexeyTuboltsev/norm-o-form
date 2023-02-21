import {
  findFirstErrorToShow, separateFormFunctionsAndData,
  setSelfAndParentsTouched,
  validateForm,
  validateSelfAndParents,
} from './core';
import { EFormTypes, TFormData, TFormValidator, TOneOfData, TSelectTagInputData } from './types';
import {  isPrimitiveValueField } from './utils';

function chooseOneOf<T extends TFormData>(oldValidator: TFormValidator<T>, formData:T, fieldData:TSelectTagInputData, value:string):T {
  const oneOf = formData[fieldData.parentPath] as TOneOfData;

  oneOf.children.forEach((childPath) => {
    delete formData[childPath];
  });

  oneOf.children = oneOf.variants[value].childrenPaths;
  oneOf.value = value;

  const {validator} = separateFormFunctionsAndData(oneOf.variants[value].children)

  const updatedValidator = {
    ...oldValidator,
    ...validator
  }

  return validateForm(
    updatedValidator as any, //TODO
    {
    ...formData,
    ...oneOf.variants[value].children,
  });
}

// export function addArrayMember(arrayId: string, place: number, intialValue, formData) {
//   const arrayData = formData[arrayId];
//   const newMemberId = generateRandomString(4);
//   const initMemberFactory = arrayData.initMembers(newMemberId, intialValue);
//
//   const { childrenPaths, children } = generateChildren([initMemberFactory], arrayId);
//
//   formData[arrayId].children.splice(place, 0, childrenPaths[0]);
//
//   const newFormData = {
//     ...formData,
//     ...children,
//   };
//
//   const formDataValidated = validateForm(newFormData);

//   return findFirstErrorToShow(setSelfAndParentsTouched(formDataValidated, arrayId), arrayId);
// }

// export function moveArrayMemberUp(arrayMemberId: string, formData) {
//   const arrayId = getParentPath(arrayMemberId);
//   const place = formData[arrayId].children.findIndex((childId) => childId === arrayMemberId);
//   const newPlace = place - 1 >= 0 ? place - 1 : 0;
//
//   return moveArrayMember(arrayMemberId, formData, arrayId, place, newPlace);
// }

// export function moveArrayMemberDown(arrayMemberId: string, formData) {
//   const arrayId = getParentPath(arrayMemberId);
//   const place = formData[arrayId].children.findIndex((childId) => childId === arrayMemberId);
//   const newPlace = place + 1 <= formData[arrayId].children.length ? place + 1 : formData[arrayId].children.length;
//
//   return moveArrayMember(arrayMemberId, formData, arrayId, place, newPlace);
// }

// export function moveArrayMember(arrayMemberId: string, formData, arrayId: string, place: number, newPlace: number) {
//   formData[arrayId].children.splice(place, 1);
//   formData[arrayId].children.splice(newPlace, 0, arrayMemberId);
//
//   const formDataValidated = validateSelfAndParents(formData, arrayId);
//   return findFirstErrorToShow(setSelfAndParentsTouched(formDataValidated, arrayId), arrayId);
// }
//
// export function removeArrayMember(arrayMemberId, formData) {
//   const arrayId = getParentPath(arrayMemberId);
//
//   formData[arrayId].children = formData[arrayId].children.filter((childId) => childId !== arrayMemberId);
//
//   formData[arrayMemberId].children.forEach((childId) => delete formData[childId]);
//   delete formData[arrayMemberId];
//
//   const formDataValidated = validateSelfAndParents(formData, arrayId);
//   return findFirstErrorToShow(setSelfAndParentsTouched(formDataValidated, arrayId), arrayId);
// }

export function handleFormChange<T extends TFormData>(validator: TFormValidator<T>, formData: T, id: string, value:any):T {
  const fieldData = formData[id];
  if (fieldData.type === EFormTypes.SELECT_TAG) {
    const newFormData = chooseOneOf<T>(validator, formData, fieldData, value);

    const validatedFormData = validateSelfAndParents<T>(validator, newFormData, id);
    return setSelfAndParentsTouched<T>(validatedFormData, id);
  } else if (isPrimitiveValueField(fieldData)) {
    fieldData.value = value;

    const validatedFormData = validateSelfAndParents(validator, formData, id);
    return setSelfAndParentsTouched(validatedFormData, id);
  } else {
    return formData
  }
}

export function handleFormBlur<T extends TFormData>(formData:T, id:string):T {
  return findFirstErrorToShow(formData, id);
}
