//@ts-nocheck

import { EFormTypes } from "./types";
import { generateRandomString } from "./utils";
import { validateForm } from "./core";

//TODO
export function deleteArrayMember(formData, arrayId: string, arrayMemberId: string) {
  const arrayData = formData[arrayId];

  const newArrayData = {
    ...arrayData,
    children: arrayData.children.filter((childId) => childId !== arrayMemberId),
  };

  delete newArrayData[arrayMemberId];

  const newFormData = {
    ...formData,
    [arrayId]: newArrayData,
  };
  // return validateSubtree(newFormData, arrayId);
}

export function insertArrayMember(
  formData,
  parentId: string,
  atIndex: number,
  arrayMemberOptions?: { [key: string]: any },
) {
  const fieldData = formData[parentId];

  if (fieldData.type === EFormTypes.ARRAY) {
    const arrayMemberId = `${parentId}.${generateRandomString(3)}`;
    const newArrayMember = fieldData.initMembers(arrayMemberId, arrayMemberOptions)();

    const newArrayMemberValidated = {} //validateForm(arrayMemberId, newArrayMember);

    formData[parentId].children.splice(atIndex, 0, arrayMemberId);
    const newFormData = {
      ...formData,
      ...newArrayMemberValidated,
    };

    // return validateSubtree(newFormData, parentId);
  }
}
