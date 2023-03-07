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
  isValidEmailAddress,
  isGeoCoordinate,
  hasMinMembers,
} from "./validators"
import {
  validateForm,
  deriveUiState,
  generateForm
} from "./core"
import {
  handleFormChange,
  handleFormBlur,
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

  isNotEmpty,
  maxLength,
  isValidEmailAddress,
  isGeoCoordinate,
  hasMinMembers,

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
