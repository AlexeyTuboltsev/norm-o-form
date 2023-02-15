import produce from "immer";
import {
  formRoot,
  isGeoCoordinate,
  isNotEmpty,
  isValidEmailAddress,
  maxLength,
  oneOf,
  select,
  textInput,
  TSelectInputData,
  TTextInputData,
  validateForm
} from "formality";

export type TOneOfExampleForm = {
  'oneOfExampleForm.appName': TTextInputData;
  'oneOfExampleForm.appVersion': TSelectInputData;
  'oneOfExampleForm.email': TTextInputData;
  'oneOfExampleForm.deviceId': TTextInputData;
};

export type TFormReducer = {
  forms: {
    oneOfExampleForm?: (TOneOfExampleForm)
  }
}


export enum EFormAction {
  OPEN_FORM = "formAction.openForm",
  CLOSE_FORM = "formAction.closeForm",
}


const initialState: TFormReducer = {
  forms : {}
}

export const formActions = {
  openForm: () => ({ type: EFormAction.OPEN_FORM }),
  closeForm: () => ({ type: EFormAction.CLOSE_FORM })
}

export enum EOneOfType {
  option1 = 'option1',
  option2 = 'option2',
}

export const ONE_OF_EXAMPLE_FORM_ROOT = 'oneOfExampleForm';

const initialFormValues = {
  appName: 'xxx',
  appVersion: '28',
  email: 'asdfasd@sdaf.xx',
  deviceId: '687943-848748',
  type: EOneOfType.option2,
  zzz: 'zzz_value',
  xxx1: 'xxx1_val',
  xxx2: 'xsadf',
};

function generateOneOfExampleFormData(
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
  return formRoot<TOneOfExampleForm>({
    formId: rootFormId,
    validations: [] as any,
    childrenFactories: [
      textInput({
        id: 'deviceId',
        value: initialValues.deviceId,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      textInput({
        id: 'email',
        value: initialValues.email,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          isValidEmailAddress({ errorMessage: 'please provide a valid email' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      textInput({
        id: 'appName',
        value: initialValues.appName,
        validations: [
          isNotEmpty({ errorMessage: 'this value is mandatory' }),
          maxLength({ errorMessage: 'maximum text length is 100 characters', maxLength: 100 }),
        ],
        isRequiredField: true,
      }),
      select({
        path: 'appVersion',
        value: initialValues.appVersion,
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
        path: 'variants',
        switcherOptions: {
          path: 'type',
          value: initialValues.type,
          options: Object.values(EOneOfType).map((option) => ({ key: option, label: option })),
        },
        variants: {
          [EOneOfType.option1]: {
            validations: [],
            children: [
              textInput({
                id: 'zzz',
                validations: [isGeoCoordinate({ errorMessage: 'this is not a geo coordinate' })],
                value: initialValues.zzz || '',
                isRequiredField: false,
              }),
            ],
          },
          [EOneOfType.option2]: {
            validations: [],
            children: [
              textInput({
                id: 'xxx1',
                validations: [isValidEmailAddress({ errorMessage: 'xxx1 is not an email' })],
                value: initialValues.xxx1 || '',
                isRequiredField: false,
              }),
              textInput({
                id: 'xxx2',
                validations: [isValidEmailAddress({ errorMessage: 'xxx1 is not an email' })],
                value: initialValues.xxx2 || '',
                isRequiredField: false,
              }),
            ],
          },
        },
      }),
    ],
  });
}

export function formReducer(state: TFormReducer = initialState, action: any) {
  switch (action.type) {
    case EFormAction.OPEN_FORM:
      return produce(state, _draftState => ({
        forms: {
          oneOfExampleForm: validateForm(generateOneOfExampleFormData(ONE_OF_EXAMPLE_FORM_ROOT, initialFormValues))
        }

      }))
    case EFormAction.CLOSE_FORM:
      return produce(state, draftState => ({
        forms: {
          oneOfExampleForm: undefined
        }
      }))
    default:
      return state
  }
}


export const selectFormState = (state: any): TFormReducer => state.form