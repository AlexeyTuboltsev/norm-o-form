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
  TFormValidator
} from "./types"
import {
  isNotEmpty,
  maxLength,
  isValidEmailAddress,
  isGeoCoordinate,
} from "./validators"
import {
  validateForm
} from "./core"
import {
  handleFormChange,
  handleFormBlur,
} from "./handlers"


export {
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

  type TFormData,
  type TFormGenerator,
  type TSelectInputData,
  type TTextInputData,
  type TFormValidator
}
