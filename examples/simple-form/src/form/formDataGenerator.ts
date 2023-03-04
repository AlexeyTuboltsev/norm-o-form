import {
  formRoot,
  isGeoCoordinate,
  isNotEmpty,
  isValidEmailAddress,
  maxLength,
  oneOf,
  select,
  textInput, TFormGenerator,
  TSelectInputData,
  TTextInputData
} from "norm-o-form";
import { TFormDataToFormGenerator, TRootFormData } from "norm-o-form/types";


export enum EOneOfType {
  option1 = 'option1',
  option2 = 'option2',
}

export type TOneOfExampleForm = {
  'oneOfExampleForm':TRootFormData;
  'oneOfExampleForm.appName': TTextInputData;
  'oneOfExampleForm.appVersion': TSelectInputData;
  'oneOfExampleForm.email': TTextInputData;
  'oneOfExampleForm.deviceId': TTextInputData;
  'oneOfExampleForm.type': TTextInputData;
  // 'oneOfExampleForm.variants'
  // 'oneOfExampleForm.variants.type': TTextInputData;
  // 'oneOfExampleForm.variants.xxx1': TTextInputData;
  // 'oneOfExampleForm.variants.xxx2': TTextInputData;
};

export const initialFormValues = {
  appName: 'xxx',
  appVersion: '28',
  email: 'asdfasd@sdaf.xx',
  deviceId: '687943-848748',
  type: EOneOfType.option2 as const,
  zzz: 'zzz_value',
  xxx1: 'xxx1_val',
  xxx2: 'xsadf',
};


export function oneOfExampleForm(
  rootFormId: string,
  initialValues: {
    appName: string;
    appVersion: string;
    email: string;
    deviceId: string;
    type: EOneOfType;
    zzz: string;
    xxx1: string;
    xxx2: string;
  },
) {
  return formRoot<TFormGenerator>({
    formId: rootFormId,
    validations: [] as any,
    children: [
      textInput({
        id: 'deviceId',
        initialValue: initialValues.deviceId,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      textInput({
        id: 'email',
        initialValue: initialValues.email,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          isValidEmailAddress({ errorMessage: 'please provide a valid email' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      textInput({
        id: 'appName',
        initialValue: initialValues.appName,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      select({
        path: 'appVersion',
        initialValue: initialValues.appVersion,
        options: [
          { key: 'appOne', label: 'appOne' },
          { key: 'appTwo', label: 'appTwo' },
        ],
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      oneOf({
        path: 'myVariants',
        initialValue:initialValues.type,
        switcherOptions: {
          path: 'switcher',
          options: Object.values(EOneOfType).map((option) => ({ key: option, label: option })),
        },
        variants: {
          [EOneOfType.option1]: {
            children: [
              textInput({
                id: 'zzz',
                validations: [isGeoCoordinate({ errorMessage: 'this is not a geo coordinate' })],
                initialValue: initialValues.zzz || '',
                isRequiredField: false,
              }),
            ],
          },
          [EOneOfType.option2]: {
            children: [
              textInput({
                id: 'xxx1',
                validations: [isValidEmailAddress({ errorMessage: 'xxx1 does not contain a valid email' })],
                initialValue: initialValues.xxx1 || '',
                isRequiredField: true,
              }),
              textInput({
                id: 'xxx2',
                validations: [isValidEmailAddress({ errorMessage: 'xxx1 is not an email' })],
                initialValue: initialValues.xxx2 || '',
                isRequiredField: false,
              }),
            ],
          },
        },
      }),
    ],
  });
}