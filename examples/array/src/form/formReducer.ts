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
import { cleanupCode, GetReturnType, replacer } from "./utils";

export enum ETab {
  FORM = 'form',
  FORM_FUNCTION = 'formFunction',
  FORM_GENERATOR = 'formGenerator',
}

export type TFormReducer = {
  [key: string]: {
    form: TFormData,
    formGeneratorView: string,
    formFunctionView: string,
    viewTab: ETab
  }
}

export enum EFormActionType {
  OPEN_FORM = "formAction.openForm",
  CLOSE_FORM = "formAction.closeForm",
  SUBMIT_FORM = "formAction.submitForm",
  UPDATE_FORM = "formAction.updateForm",
}

export enum EViewActionType {
  CHANGE_TAB = "changeTab",
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


export const formActions = {
  openForm: () => ({ type: EFormActionType.OPEN_FORM as const }),
  closeForm: () => ({ type: EFormActionType.CLOSE_FORM as const }),
  submitForm: () => ({ type: EFormActionType.SUBMIT_FORM as const }),
  updateForm: (payload: TFormUpdate) => ({
    type: EFormActionType.UPDATE_FORM as const,
    payload
  }),
}

export const viewActions = {
  changeTab: (payload: {tabId: ETab}) => ({type: EViewActionType.CHANGE_TAB, payload})
}



export const ARRAY_EXAMPLE_FORM_ROOT = 'arrayExampleForm';

const formGenerator = arrayExampleForm(ARRAY_EXAMPLE_FORM_ROOT)

const initialState: TFormReducer = {}



export const formReducer = produce((draftState: TFormReducer = initialState, action: GetReturnType<typeof formActions & typeof viewActions>) => {
  switch (action.type) {
    case EFormActionType.OPEN_FORM:
      draftState.arrayExampleForm = {
        formFunctionView: cleanupCode(arrayExampleForm.toString()),
        formGeneratorView: JSON.stringify(formGenerator, replacer, 2),
        form: generateForm(formGenerator, initialFormValues) as TArrayExampleForm,
        viewTab: ETab.FORM
      }
      break;
    case EFormActionType.CLOSE_FORM:
      delete draftState.arrayExampleForm
      break;
    case EFormActionType.UPDATE_FORM: {
      if (draftState.arrayExampleForm) {
        // const formId = action.payload.fieldId.split(".")[0]

        switch (action.payload.updateType) {
          case EFormUpdateType.CHANGE: {
            const formData = draftState.arrayExampleForm.form
            draftState.arrayExampleForm.form = handleFormChange(formGenerator, action.payload.fieldId, formData, action.payload.value) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.BLUR: {
            const formData = draftState.arrayExampleForm.form
            draftState.arrayExampleForm.form = handleFormBlur(formGenerator, action.payload.fieldId, formData,) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.INSERT_ARRAY_MEMBER: {
            const formData = draftState.arrayExampleForm.form
            draftState.arrayExampleForm.form = insertArrayMember(formGenerator, action.payload.fieldId, formData, action.payload.position) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.MOVE_ARRAY_MEMBER: {
            const formData = draftState.arrayExampleForm.form
            draftState.arrayExampleForm.form = moveArrayMember(formGenerator, action.payload.fieldId, formData, action.payload.targetPosition) as TArrayExampleForm
            break;
          }
          case EFormUpdateType.REMOVE_ARRAY_MEMBER: {
            console.log("REMOVE_ARRAY_MEMBER")
            const formData = draftState.arrayExampleForm.form
            draftState.arrayExampleForm.form = removeArrayMember(formGenerator, action.payload.fieldId, formData) as TArrayExampleForm
            break;
          }
        }
      }
      break;
    }
    case EViewActionType.CHANGE_TAB:{
      draftState.arrayExampleForm.viewTab = action.payload.tabId
      break;
    }
    default:
      return draftState
  }

})


export const selectFormState = (state: any): TFormReducer => state.form