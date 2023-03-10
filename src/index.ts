import {
  formRoot,
  array,
  validationGroup,
  oneOf,
  textInput,
  numericInput,
  select,
} from "./formDataGenerators";
import {
  TFormData,
  TSelectFieldData,
  TTextFieldData,
  TFormGenerator,
  TFormValidator,
  EFormTypes,
  TValidationFn
} from "./types"
import {
  isNotEmpty,
  maxLength,
  minLength,
  isValidEmailAddress,
  isGeoCoordinate,
  hasMinMembers,
  eitherAllOrNone,
  isValidPhoneNumber
} from "./validators"
import {
  validateForm,
  deriveUiState,
  generateForm
} from "./core"
import {
  handleFormChange,
  handleFormBlur,
  insertArrayMember,
  removeArrayMember,
  moveArrayMember
} from "./handlers"
import {
  formDataToButtonState,
  getFormRoot,
} from "./utils"

export {
  generateForm,
  deriveUiState,
  validateForm,
  formRoot,
  array,
  validationGroup,
  oneOf,
  textInput,
  numericInput,
  select,

  handleFormBlur,
  handleFormChange,
  insertArrayMember,
  removeArrayMember,
  moveArrayMember,

  isNotEmpty,
  minLength,
  maxLength,
  isValidEmailAddress,
  isGeoCoordinate,
  hasMinMembers,
  eitherAllOrNone,
  isValidPhoneNumber,

  formDataToButtonState,
  getFormRoot,

  type TFormData,
  type TFormGenerator,
  type TSelectFieldData,
  type TTextFieldData,
  type TFormValidator,
  type EFormTypes,
  type TValidationFn
}
