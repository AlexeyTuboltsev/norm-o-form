import produce from "immer";
import {
  handleFormChange,
  TFormData,
  validateForm,
  separateFormFunctionsAndData,
  EFormTypes,
  TValidationFn,
  handleFormBlur
} from "norm-o-form";
import { generateOneOfExampleFormData, initialFormValues, TOneOfExampleForm } from "./formDataGenerator";
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

type TFormValidator<T extends TFormData> = {[I in keyof T]:TValidationFn[]}

export const ONE_OF_EXAMPLE_FORM_ROOT = 'oneOfExampleForm';


let { validator, formData } = separateFormFunctionsAndData<TOneOfExampleForm>(
  generateOneOfExampleFormData(ONE_OF_EXAMPLE_FORM_ROOT, initialFormValues)
)


export const formReducer = (state: TFormReducer = initialState, action: GetReturnType<typeof formActions>) => {
  return produce(state, draftState => {
    switch (action.type) {
      case EFormActionType.OPEN_FORM:
        console.log(formData)
        draftState.oneOfExampleForm = validateForm<TOneOfExampleForm>(validator,formData)
        break;
      case EFormActionType.CLOSE_FORM:
        draftState.oneOfExampleForm = undefined
        break;
      case EFormActionType.UPDATE_FORM: {
        if (draftState.oneOfExampleForm) {
          switch (action.payload.updateType) {
            case EFormUpdateType.CHANGE: {
              const formData = draftState.oneOfExampleForm
              const { formData:newFormData, validator:newValidator } = handleFormChange(validator,formData, action.payload.fieldId, action.payload.value)
              //todo
              validator = newValidator
              draftState.oneOfExampleForm = newFormData
              break;
            }
            case EFormUpdateType.BLUR: {
              const formData = draftState.oneOfExampleForm
              draftState.oneOfExampleForm = handleFormBlur(formData, action.payload.fieldId)

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