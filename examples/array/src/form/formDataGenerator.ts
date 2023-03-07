import {
  array,
  formRoot,
  hasMinMembers, isGeoCoordinate,
  isNotEmpty,
  isValidEmailAddress,
  maxLength, oneOf,
  textInput,
  TSelectFieldData,
  TTextFieldData
} from "norm-o-form";
import { TArrayData, TRootFormData } from "norm-o-form/types";
import { eitherAllOrNone, minLength } from "norm-o-form/validators";

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
  zzz: 'zzz_value',
  xxx1: 'xxx1_val',
  xxx2: 'xsadf',
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
          isValidEmailAddress({ errorMessage: 'please provide a valid email' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      oneOf({
        id: 'myVariants',
        getValue:  (initialValues) => initialValues.type,
        // defaultValues: {},
        switcherOptions: {
          // path: 'switcher',
          options: Object.values(EOneOfType).map((option) => ({ key: option, label: option })),
        },
        variants: {
          [EOneOfType.option1]: {
            children: [
              textInput({
                id: 'zzz',
                validations: [isGeoCoordinate({ errorMessage: 'this is not a geo coordinate' })],
                getValue: (initialValues) => initialValues.zzz,
                isRequiredField: false,
              }),
            ],
          },
          [EOneOfType.option2]: {
            children: [
              textInput({
                id: 'xxx1',
                validations: [isValidEmailAddress({ errorMessage: 'xxx1 does not contain a valid email' })],
                getValue: (initialValues) => initialValues.xxx1,
                isRequiredField: true,
              }),
              textInput({
                id: 'xxx2',
                validations: [isValidEmailAddress({ errorMessage: 'xxx1 is not an email' })],
                getValue: (initialValues) => initialValues.xxx2,
                isRequiredField: false,
              }),
            ],
          },
        },
      }),
      array({
        id: 'favoriteArtists',
        validations: [hasMinMembers({ errorMessage: 'array should have at least 1 member', atLeast: 1 })],
        getValue: (initialValues) => initialValues.favoriteArtists,
        arrayMember: {
          defaultValues: { name: "", album: "" },
          validations: [eitherAllOrNone({errorMessage:"fields should either all be valid or empty"})],
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