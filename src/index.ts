import {
  formRoot,
  array,
  validationGroup,
  oneOf,
  textField,
  textInput,
  numericInput,
  select,
  selectTag,
} from "./formDataGenerators";
import {
  TFormData,
  TSelectInputData,
  TTextInputData,
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
  textField,
  textInput,
  numericInput,
  select,
  selectTag,

  handleFormBlur,
  handleFormChange,

  isNotEmpty,
  maxLength,
  isValidEmailAddress,
  isGeoCoordinate,

  formDataToButtonState,
  getFormRoot,

  type TFormData,
  type TFormGenerator,
  type TSelectInputData,
  type TTextInputData,
  type TFormValidator,
  type EFormTypes,
  type TValidationFn
}
