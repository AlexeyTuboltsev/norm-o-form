import produce from "immer";
import { handleFormChange, TSelectInputData, TTextInputData, validateForm } from "formality";
import { generateOneOfExampleFormData, initialFormValues } from "./formDataGenerator";
import { GetReturnType } from "./utils";

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


export const ONE_OF_EXAMPLE_FORM_ROOT = 'oneOfExampleForm';


export function formReducer(state: TFormReducer = initialState, action: GetReturnType<typeof formActions>) {
  switch (action.type) {
    case EFormActionType.OPEN_FORM:
      return produce(state, _draftState => ({
        oneOfExampleForm: validateForm(generateOneOfExampleFormData(ONE_OF_EXAMPLE_FORM_ROOT, initialFormValues))
      }))
    case EFormActionType.CLOSE_FORM:
      return produce(state, _draftState => ({
        oneOfExampleForm: undefined
      }))
    case EFormActionType.UPDATE_FORM: {
      switch (action.payload.updateType) {
        case EFormUpdateType.CHANGE: {
          return produce(state, draftState => {
            if (draftState.oneOfExampleForm) {
              const formData = draftState.oneOfExampleForm
              handleFormChange(formData, action.payload.fieldId, action.payload.value)

            }
          })
        }
        case EFormUpdateType.BLUR:
        case EFormUpdateType.FOCUS:
        case EFormUpdateType.PASTE:
        default: {
          return produce(state, draftState => draftState)
        }
      }
    }
    default:
      return state
  }
}


export const selectFormState = (state: any): TFormReducer => state.form