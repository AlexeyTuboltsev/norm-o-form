import produce from "immer";
import {
  insertArrayMember,
  generateForm,
  handleFormBlur,
  handleFormChange,
  removeArrayMember,
  moveArrayMember,
  TFormData
} from "norm-o-form";
import { arrayExampleForm, initialFormValues, TArrayExampleForm } from "./formDefinition";
import { GetReturnType } from "./utils";


export type TFormReducer = {
  [key: string]: TFormData
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
  INSERT_ARRAY_MEMBER = "addArrayMember",
  REMOVE_ARRAY_MEMBER = "removeArrayMember",
  MOVE_ARRAY_MEMBER = "moveArrayMember",
}

export type TFormUpdate =
  | { updateType: (EFormUpdateType.FOCUS | EFormUpdateType.CHANGE | EFormUpdateType.BLUR | EFormUpdateType.PASTE), fieldId: string, value: string }
  | { updateType: EFormUpdateType.INSERT_ARRAY_MEMBER, fieldId: string, position: number }
  | { updateType: EFormUpdateType.REMOVE_ARRAY_MEMBER, fieldId: string, }
  | { updateType: EFormUpdateType.MOVE_ARRAY_MEMBER, fieldId: string, targetPosition: number }

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
      draftState.arrayExampleForm = generateForm(formGenerator, initialFormValues) as TArrayExampleForm
      break;
    case EFormActionType.CLOSE_FORM:
      delete draftState.arrayExampleForm
      break;
    case EFormActionType.UPDATE_FORM: {
      if (draftState.arrayExampleForm) {
        // const formId = action.payload.fieldId.split(".")[0]

        switch (action.payload.updateType) {
          case EFormUpdateType.CHANGE: {
            const formData = draftState.arrayExampleForm
            draftState.arrayExampleForm = handleFormChange(formGenerator, action.payload.fieldId, formData, action.payload.value) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.BLUR: {
            const formData = draftState.arrayExampleForm
            draftState.arrayExampleForm = handleFormBlur(formGenerator, action.payload.fieldId, formData,) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.INSERT_ARRAY_MEMBER: {
            const formData = draftState.arrayExampleForm
            draftState.arrayExampleForm = insertArrayMember(formGenerator, action.payload.fieldId, formData, action.payload.position) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.MOVE_ARRAY_MEMBER: {
            const formData = draftState.arrayExampleForm
            draftState.arrayExampleForm = moveArrayMember(formGenerator, action.payload.fieldId,formData, action.payload.targetPosition ) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.REMOVE_ARRAY_MEMBER: {
            console.log("REMOVE_ARRAY_MEMBER")
            const formData = draftState.arrayExampleForm
            draftState.arrayExampleForm = removeArrayMember(formGenerator, action.payload.fieldId, formData) as TArrayExampleForm
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