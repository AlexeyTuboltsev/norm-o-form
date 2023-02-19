import produce from "immer";
import { handleFormChange, TFormData, TFormGenerator, TSelectInputData, TTextInputData, validateForm } from "formality";
import { generateOneOfExampleFormData, initialFormValues } from "./formDataGenerator";
import { GetReturnType, TFormDataToFormGenerator } from "./utils";
import { TFormFieldData, TValidationFn } from "formality/types";

export type TOneOfExampleForm = {
  'oneOfExampleForm.appName': TTextInputData;
  'oneOfExampleForm.appVersion': TSelectInputData;
  'oneOfExampleForm.email': TTextInputData;
  'oneOfExampleForm.deviceId': TTextInputData;
};

export type TFormReducer = {
  oneOfExampleForm?: (TOneOfExampleForm)
}

export enum EFormActionType {
  OPEN_FORM = "formAction.openForm",
  CLOSE_FORM = "formAction.closeForm",
  UPDATE_FORM = "updateForm"
}


export enum EFormUpdateType {
  FOCUS = "formUpdateType.focus",
  CHANGE = "formUpdateType.change",
  PASTE = "formUpdateType.paste",
  BLUR = "formUpdateType.blur",
}

export type TFormUpdate = { updateType: EFormUpdateType, formId: string, fieldId: string, value: string }

const initialState: TFormReducer = {}

export const formActions = {
  openForm: () => ({ type: EFormActionType.OPEN_FORM as const }),
  closeForm: () => ({ type: EFormActionType.CLOSE_FORM as const }),
  updateForm: (payload: TFormUpdate) => ({
    type: EFormActionType.UPDATE_FORM as const,
    payload
  }),
}

type TFormValidator<T extends TFormData> = {[I in keyof T]:TValidationFn[]}

type TValidatorAndFormData<T extends TFormData> = {validator: TFormValidator<T>, formDataGenerator: T}

function extractValidatorAndFormData<T extends TFormData>(formGenerator: TFormDataToFormGenerator<T>): {validator: TFormValidator<T>, formDataGenerator: T} {
  return Object.keys(formGenerator).reduce((acc:TValidatorAndFormData<T>, id:keyof T) => {
    acc.validator[id] = [...formGenerator[id].validations]
    acc.formDataGenerator[id] = { ...formGenerator[id] } as any
    delete (acc.formDataGenerator[id] as any).validations

    return acc
  },{
    validator: {},
    formDataGenerator: {}
  } as  TValidatorAndFormData<T>)
}

export const ONE_OF_EXAMPLE_FORM_ROOT = 'oneOfExampleForm';


const { validator, formDataGenerator } = extractValidatorAndFormData(
  generateOneOfExampleFormData(ONE_OF_EXAMPLE_FORM_ROOT, initialFormValues)
)


export const formReducer = (state: TFormReducer = initialState, action: GetReturnType<typeof formActions>) => {
  return produce(state, draftState => {
    switch (action.type) {
      case EFormActionType.OPEN_FORM:
        console.log(formDataGenerator)
        draftState.oneOfExampleForm = validateForm(validator,formDataGenerator)
        break;
      case EFormActionType.CLOSE_FORM:
        draftState.oneOfExampleForm = undefined
        break;
      case EFormActionType.UPDATE_FORM: {
        if (draftState.oneOfExampleForm) {
          switch (action.payload.updateType) {
            case EFormUpdateType.CHANGE: {
              const formData = draftState.oneOfExampleForm
              handleFormChange(validator,formData, action.payload.fieldId, action.payload.value)
              break;
            }
            default:
              break;
          }
        }
      }
    }
  })
}


export const selectFormState = (state: any): TFormReducer => state.form