export type TValidationFn = (id: string, data:TFormFieldData) => undefined | string

// export type TFormDataGeneratorFn<T extends TForm> =
//   ({formId,validations,childrenFactories}:{formId: string,validations:TValidationFn,childrenFactories:TFormDataGeneratorFn<T>}) =>T

// export type TT<> = (parentId?: string) => {
//   [fullPath: string]: TTextInputData;
// }
export type TGeneralFormData = {
  children: string[];
  id: string;
  errors: string[];
  showError: boolean;
  touched: boolean;
  isRequiredField: boolean;
  validations: TValidationFn[];
};

export enum EFormTypes {
  ROOT = 'root',
  TEXT_INPUT = 'textInput',
  TEXT_FIELD = 'textField',
  SELECT = 'select',
  SELECT_TAG = 'selectTag',
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

export type TSelectInputData = { type: EFormTypes.SELECT; value: string } & TGeneralFormData & {
    options: { key: string; label: string }[];
  };

export type TSelectTagInputData = { type: EFormTypes.SELECT_TAG; value: string } & TGeneralFormData & {
    options: { key: string; label: string }[];
    parentPath: string;
  };

export type TTextInputData = { type: EFormTypes.TEXT_INPUT; value: string } & TGeneralFormData;

export type TIntegerInputData = { type: EFormTypes.INTEGER_INPUT; value: string } & TGeneralFormData;

export type TArrayData = { type: EFormTypes.ARRAY } & TGeneralFormData & {
    initMembers: (...args: any[]) => { [key: string]: TFormFieldData };
  };

export type TRootFormData = { type: EFormTypes.ROOT } & TGeneralFormData;

export type TValidationGroupData = { type: EFormTypes.VALIDATION_GROUP } & TGeneralFormData;

export type TOneOfData = { type: EFormTypes.ONE_OF; value: string } & TGeneralFormData & {
    variants: { [key: string]: { childrenPaths: string[]; children: any } };
  };

export type TFormFieldData =
  | TRootFormData
  | TTextInputData
  | TSelectInputData
  | TValidationGroupData
  | TIntegerInputData
  | TArrayData
  | TOneOfData
  | TSelectTagInputData;

export type TForm = { [key: string]: TFormFieldData };
