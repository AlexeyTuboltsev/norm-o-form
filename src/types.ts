export type TValidationFn = (id: string, data: TFormData) => undefined | string


export type TGeneralFormData = {
  children: string[];
  id: string;
  lookupPath: string;
  errors: string[];
  showError: boolean;
  touched: boolean;
  isRequiredField: boolean;
};

export enum EFormTypes {
  ROOT = 'root',
  TEXT_INPUT = 'textInput',
  TEXT_FIELD = 'textField',
  SELECT = 'select',
  INTEGER_INPUT = 'integerInput',
  VALIDATION_GROUP = 'validationGroup',
  ARRAY = 'array',
  ONE_OF = 'oneOf',
}

export enum EButtonState {
  ACTIVE = 'active',
  LOADING = 'loading',
  DISABLED = 'disabled',
}

export type TRootGenerator = {
  type: EFormTypes.ROOT;
  id: string,
  lookupPath: string;
  children: string[];
  validations: TValidationFn[]
  generate: (value: any) => TRootFormData
}

export type TRootFormData = { type: EFormTypes.ROOT } & TGeneralFormData;

export type TValidationGroupGenerator = {
  type: EFormTypes.VALIDATION_GROUP;
  id: string,
  lookupPath: string;
  children: string[];
  validations: TValidationFn[]
  generate: (value: any) => TValidationGroupData
}

export type TValidationGroupData = { type: EFormTypes.VALIDATION_GROUP } & TGeneralFormData;

export type TOneOfGenerator = {
  type: EFormTypes.ONE_OF;
  id: string,
  lookupPath: string;
  children: string[];
  validations: TValidationFn[]
  initialValue: string;
  generate: (options: { value: any }) => TOneOfData
}

export type TOneOfData = { type: EFormTypes.ONE_OF; value: string; options: { key: string; label: string }[]; } & TGeneralFormData

export type TTextInputGenerator = {
  type: EFormTypes.TEXT_INPUT;
  id: string,
  lookupPath: string;
  children: [];
  validations: TValidationFn[]
  initialValue: string;
  generate: (options: { value: any }) => TTextFieldData
}

export type TTextFieldData = { type: EFormTypes.TEXT_INPUT; value: string } & TGeneralFormData;

export type TSelectGenerator = {
  type: EFormTypes.SELECT;
  id: string,
  lookupPath: string;
  children: [];
  validations: TValidationFn[]
  initialValue: string;
  generate: (options: { value: any }) => TSelectFieldData
}

export type TSelectFieldData = { type: EFormTypes.SELECT; value: string; options: Array<{ key: string; label: string }>; } & TGeneralFormData

export type TNumericGenerator = {
  type: EFormTypes.INTEGER_INPUT;
  id: string,
  lookupPath: string;
  children: [];
  validations: TValidationFn[]
  initialValue: string;
  generate: (options: { value: any }) => TNumericFieldData
}
export type TNumericFieldData = { type: EFormTypes.INTEGER_INPUT; value: string } & TGeneralFormData;


export type TFormFieldGenerator =
  | TRootGenerator
  | TValidationGroupGenerator
  | TOneOfGenerator
  | TTextInputGenerator
  | TSelectGenerator
  | TNumericGenerator


export type TFormFieldData =
  | TRootFormData
  | TValidationGroupData
  | TTextFieldData
  | TSelectFieldData
  | TNumericFieldData
  | TOneOfData;


export type TFormData = { [key: string]: TFormFieldData };
export type TFormGenerator = { [key: string]: TFormFieldGenerator };
export type TFormValidator<T> = { [I in keyof T]: TValidationFn[] }
