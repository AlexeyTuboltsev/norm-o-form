import produce from "immer";
import { deriveUiState, generateForm, handleFormBlur, handleFormChange, validateForm } from "norm-o-form";
import { oneOfExampleForm, initialFormValues, TOneOfExampleForm } from "./formDataGenerator";
import { GetReturnType } from "./utils";


export type TFormReducer = {
  oneOfExampleForm?: (TOneOfExampleForm)
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

export const ONE_OF_EXAMPLE_FORM_ROOT = 'oneOfExampleForm';

const formGenerator = oneOfExampleForm(ONE_OF_EXAMPLE_FORM_ROOT, initialFormValues)

export const formReducer = produce((draftState: TFormReducer = initialState, action: GetReturnType<typeof formActions>) => {
    switch (action.type) {
      case EFormActionType.OPEN_FORM:
        draftState.oneOfExampleForm = generateForm(formGenerator) as TOneOfExampleForm
        break;
      case EFormActionType.CLOSE_FORM:
        draftState.oneOfExampleForm = undefined
        break;
      case EFormActionType.UPDATE_FORM: {
        if (draftState.oneOfExampleForm) {
          switch (action.payload.updateType) {
            case EFormUpdateType.CHANGE: {
              const formData = draftState.oneOfExampleForm
              draftState.oneOfExampleForm =handleFormChange(formGenerator, action.payload.fieldId,formData, action.payload.value) as TOneOfExampleForm
              break;
            }
            case EFormUpdateType.BLUR: {
              const formData = draftState.oneOfExampleForm
              draftState.oneOfExampleForm = handleFormBlur(formGenerator, action.payload.fieldId,formData, ) as TOneOfExampleForm
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