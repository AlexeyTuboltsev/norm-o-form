import produce from "immer";
import { generateForm, handleFormBlur, handleFormChange } from "norm-o-form";
import { arrayExampleForm, initialFormValues, TArrayExampleForm } from "./formDataGenerator";
import { GetReturnType } from "./utils";


export type TFormReducer = {
  arrayExampleForm?: (TArrayExampleForm)
}

export enum EFormActionType {
  OPEN_FORM = "formAction.openForm",
  CLOSE_FORM = "formAction.closeForm",
  SUBMIT_FORM = "formAction.submitForm",
  UPDATE_FORM = "formAction.updateForm",
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
  submitForm: () => ({ type: EFormActionType.SUBMIT_FORM as const }),
  updateForm: (payload: TFormUpdate) => ({
    type: EFormActionType.UPDATE_FORM as const,
    payload
  }),
}

export const ARRAY_EXAMPLE_FORM_ROOT = 'arrayExampleForm';

const formGenerator = arrayExampleForm(ARRAY_EXAMPLE_FORM_ROOT)

export const formReducer = produce((draftState: TFormReducer = initialState, action: GetReturnType<typeof formActions>) => {
    switch (action.type) {
      case EFormActionType.OPEN_FORM:
        draftState.arrayExampleForm = generateForm(formGenerator,initialFormValues) as TArrayExampleForm
        break;
      case EFormActionType.CLOSE_FORM:
        draftState.arrayExampleForm = undefined
        break;
      case EFormActionType.UPDATE_FORM: {
        if (draftState.arrayExampleForm) {
          switch (action.payload.updateType) {
            case EFormUpdateType.CHANGE: {
              const formData = draftState.arrayExampleForm
              draftState.arrayExampleForm =handleFormChange(formGenerator, action.payload.fieldId,formData, action.payload.value) as TArrayExampleForm
              break;
            }
            case EFormUpdateType.BLUR: {
              const formData = draftState.arrayExampleForm
              draftState.arrayExampleForm = handleFormBlur(formGenerator, action.payload.fieldId,formData, ) as TArrayExampleForm
              break;
            }
            default:
              break;
          }
        }
        break;
      }
      default:
        return draftState
    }

})


export const selectFormState = (state: any): TFormReducer => state.form