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
  TForm,
  TSelectInputData,
  TTextInputData
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

  type TForm,
  type TSelectInputData,
  type TTextInputData,
}
