import {
  deriveUiState,
  findFirstErrorToShow,
  setSelfAndParentsTouched,
  validateSelfAndParents,
} from './core';
import { EFormTypes, TFormData, TFormGenerator, TOneOfData } from './types';
import { getSwitcherPath, isPrimitiveValueField } from './utils';

function chooseOneOf(
  formGenerator: TFormGenerator,
  fieldId: string,
  formData: TFormData,
  value: string
): TFormData {
  const switcherPath = getSwitcherPath(fieldId)

  if (!switcherPath) {
    return formData
  } else {

    (formGenerator[switcherPath] as TOneOfData).value = value;
    return deriveUiState(formGenerator)
  }
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

export function handleFormChange(formGenerator: TFormGenerator, id: string, formData: TFormData, value: any): TFormData {
  const fieldData = formData[id];

  if (fieldData.type === EFormTypes.SELECT_TAG) {

    //todo first set touched and then validate
    return setSelfAndParentsTouched(
      formGenerator,
      id,
      validateSelfAndParents(
        formGenerator,
        id,
        chooseOneOf(formGenerator, id, formData, value),
      ),
    )

  } else if (isPrimitiveValueField(fieldData)) {
    fieldData.value = value;

    //todo first set touched and then validate
    return setSelfAndParentsTouched(
      formGenerator,
      id,
      validateSelfAndParents(formGenerator, id, formData),
    )
  } else {
    return formData
  }
}

export function handleFormBlur(formGenerator: TFormGenerator, id: string, formData: TFormData): TFormData {
  return findFirstErrorToShow(formGenerator, id, formData);
}
