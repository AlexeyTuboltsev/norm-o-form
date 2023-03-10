import {
  array,
  eitherAllOrNone,
  formRoot,
  hasMinMembers,
  isNotEmpty,
  isValidEmailAddress,
  isValidPhoneNumber,
  maxLength,
  minLength,
  oneOf,
  textInput,
  TSelectFieldData,
  TTextFieldData
} from "norm-o-form";
import { TArrayData, TRootFormData } from "norm-o-form/types";

export enum EOneOfType {
  option1 = 'option1',
  option2 = 'option2',
}

export type TArrayExampleForm = {
  'arrayExampleForm': TRootFormData;
  'arrayExampleForm.firstName': TTextFieldData;
  'arrayExampleForm.lastName': TSelectFieldData;
  'arrayExampleForm.favoriteArtists': TArrayData;

};

export const initialFormValues = {
  firstName: "John",
  lastName: "Doe",
  type: EOneOfType.option2 as const,
  phone: 'xxx1_val',
  fax: '22',
  favoriteArtists: [
    { name: "The Clash", album: "Combat Rock" },
    { name: "Robert Wyatt", album: "Rock Bottom" },
    { name: "Bjork", album: "Delicious Demon" }
  ]
};

export function arrayExampleForm(
  rootFormId: string,
) {
  return formRoot({
    formId: rootFormId,
    validations: [] as any,
    children: [
      textInput({
        id: 'firstName',
        getValue: (initialValues) => initialValues.firstName,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      textInput({
        id: 'lastName',
        getValue: (initialValues) => initialValues.lastName,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      oneOf({
        id: 'myVariants',
        getValue: (initialValues) => initialValues.type,
        // defaultValues: {}, //todo
        switcherOptions: {
          options: Object.values(EOneOfType).map((option) => ({ key: option, label: option })),
        },
        variants: {
          [EOneOfType.option1]: {
            children: [
              textInput({
                id: 'email',
                validations: [isValidEmailAddress({ errorMessage: 'this is not an email' })],
                getValue: (initialValues) => initialValues.email,
                isRequiredField: false,
              }),
            ],
          },
          [EOneOfType.option2]: {
            children: [
              textInput({
                id: 'phone',
                validations: [isValidPhoneNumber({ errorMessage: 'this is not a valid phone number' })],
                getValue: (initialValues) => initialValues.phone,
                isRequiredField: true,
              }),
              textInput({
                id: 'fax',
                validations: [isValidPhoneNumber({ errorMessage: 'this is not a valid phone number' })],
                getValue: (initialValues) => initialValues.fax,
                isRequiredField: false,
              }),
            ],
          },
        },
      }),
      array({
        id: 'favoriteArtists',
        validations: [hasMinMembers({ errorMessage: 'array should have at least 3 members', atLeast: 3 })],
        getValue: (initialValues) => initialValues.favoriteArtists,
        arrayMember: {
          defaultValue: { name: "", album: "" },
          validations: [eitherAllOrNone({ errorMessage: "both fields should either be valid or empty" })],
          children: [
            textInput({
              id: 'name',
              getValue: (defaultValues) => defaultValues.name,
              isRequiredField: false,
              validations: [
                minLength({ errorMessage: 'minimum text length is 2 characters', minLength: 2 }),
                maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
              ]
            }),
            textInput({
              id: 'album',
              getValue: (defaultValues) => defaultValues.album,
              isRequiredField: false,
              validations: [
                minLength({ errorMessage: 'minimum text length is 2 characters', minLength: 2 }),
                maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
              ]
            })
          ]
        }
      }),
    ],
  });
}