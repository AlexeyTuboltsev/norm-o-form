export type TValidationFn = (id: string, data: TFormData) => undefined | string


export type TGeneralFormData = {
  children: string[];
  path: string;
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
  ARRAY_MEMBER = 'arrayMember',
  ONE_OF = 'oneOf',
}

export enum EButtonState {
  ACTIVE = 'active',
  LOADING = 'loading',
  DISABLED = 'disabled',
}

export type TRootGenerator = {
  type: EFormTypes.ROOT;
  path: string,
  lookupPath: string;
  children: string[];
  validations: TValidationFn[]
  getValue: <T>(initialValues:T)=> T //pass through
  generate: (value: any) => TRootFormData
}

export type TRootFormData = { type: EFormTypes.ROOT } & TGeneralFormData;

export type TValidationGroupGenerator = {
  type: EFormTypes.VALIDATION_GROUP;
  path: string,
  children: string[];
  validations: TValidationFn[]
  getValue: <T>(initialValues:T)=> T //pass through
  generate: (options:{lookupPath:string}) => TValidationGroupData
}

export type TValidationGroupData = { type: EFormTypes.VALIDATION_GROUP } & TGeneralFormData;

export type TOneOfGenerator = {
  type: EFormTypes.ONE_OF;
  path: string,
  children: string[];
  validations: TValidationFn[]
  getValue: (initialValues:any) => string;
  generate: (options: { value: any, lookupPath:string }) => TOneOfData
}

export type TOneOfData = { type: EFormTypes.ONE_OF; value: string; options: { key: string; label: string }[]; } & TGeneralFormData

export type TTextInputGenerator = {
  type: EFormTypes.TEXT_INPUT;
  id: string;
  path: string,
  children: [];
  validations: TValidationFn[]
  getValue: (initialValues:any) => string;
  generate: (options: { value: string,lookupPath:string }) => TTextFieldData
}

export type TTextFieldData = { type: EFormTypes.TEXT_INPUT; value: string } & TGeneralFormData;

export type TSelectGenerator = {
  type: EFormTypes.SELECT;
  path: string,
  children: [];
  validations: TValidationFn[]
  getValue: (initialValues:any) => string;
  generate: (options: { value: any,lookupPath:string }) => TSelectFieldData
}

export type TSelectFieldData = { type: EFormTypes.SELECT; value: string; options: Array<{ key: string; label: string }>; } & TGeneralFormData

export type TNumericGenerator = {
  type: EFormTypes.INTEGER_INPUT;
  path: string,
  children: [];
  validations: TValidationFn[]
  getValue: (initialValues:any) => string;
  generate: (options: { value: any,lookupPath:string }) => TNumericFieldData
}
export type TNumericFieldData = { type: EFormTypes.INTEGER_INPUT; value: string } & TGeneralFormData;

export type TArrayGenerator = {
  type: EFormTypes.ARRAY;
  path: string,
  children: string[];
  validations: TValidationFn[]
  getValue: (initialValues:any) => any[];
  generate: (options: { children: string[],lookupPath:string }) => TArrayData
}

export type TArrayData = {type :EFormTypes.ARRAY} & TGeneralFormData

export type TArrayMemberGenerator = {
  type: EFormTypes.ARRAY_MEMBER;
  path: string,
  children: string[];
  validations: TValidationFn[];
  getValue: <T>(initialValues:T)=> T //pass through
  generate: (options: { childrenPaths:string[], path:string }) => TArrayMemberData
}
export type TArrayMemberData = {type :EFormTypes.ARRAY_MEMBER} & TGeneralFormData

export type TFormFieldGenerator =
  | TRootGenerator
  | TValidationGroupGenerator
  | TOneOfGenerator
  | TTextInputGenerator
  | TSelectGenerator
  | TNumericGenerator
  | TArrayGenerator
  | TArrayMemberGenerator;


export type TFormFieldData =
  | TRootFormData
  | TValidationGroupData
  | TTextFieldData
  | TSelectFieldData
  | TNumericFieldData
  | TOneOfData
  | TArrayData
  | TArrayMemberData;


export type TFormData = { [key: string]: TFormFieldData };
export type TFormGenerator = { [key: string]: TFormFieldGenerator };
export type TFormValidator<T> = { [I in keyof T]: TValidationFn[] }
