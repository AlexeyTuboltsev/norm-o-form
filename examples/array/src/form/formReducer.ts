import produce from "immer";
import { insertArrayMember, generateForm, handleFormBlur, handleFormChange } from "norm-o-form";
import { arrayExampleForm, initialFormValues, TArrayExampleForm } from "./formDefinition";
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
  INSERT_ARRAY_MEMBER = "addArrayMember"
}

export type TFormUpdate =
  |{ updateType: (EFormUpdateType.FOCUS|EFormUpdateType.CHANGE|EFormUpdateType.BLUR | EFormUpdateType.PASTE), formId: string, fieldId: string, value: string }
  |{ updateType: EFormUpdateType.INSERT_ARRAY_MEMBER, formId: string, fieldId: string, position: number}

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
            case EFormUpdateType.INSERT_ARRAY_MEMBER: {
              const formData = draftState.arrayExampleForm
              console.log("INSERT_ARRAY_MEMBER",action.payload)
              const x = insertArrayMember(formGenerator, action.payload.fieldId,formData,action.payload.position ) as TArrayExampleForm
              draftState.arrayExampleForm = x
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