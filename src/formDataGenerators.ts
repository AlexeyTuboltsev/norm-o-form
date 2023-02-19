import { EFormTypes, TFormData, TTextInputData, TValidationFn } from './types';
import { childrenAreValid } from './validators';
import { generateRandomString } from './utils';


export function formRoot<T extends TFormData>({ formId, validations, childrenFactories }:
  {formId: string,validations:TValidationFn,childrenFactories:Array<(parentId?: string)=>TFormData>}
):T {
  const { children, childrenPaths } = generateChildren(childrenFactories, formId);

  return {
    [formId]: {
      id: formId,
      type: EFormTypes.ROOT as const,
      children: childrenPaths,
      errors: [],
      showError: false,
      touched: false,
      isRequiredField: true,
      validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
    },
    ...children,
  } as any;
}

export function array({ path, validations, memberFactory, value }:any) {
  return function (parentPath: string) {
    const arrayPath = generateFullPath(path, parentPath);

    const res = value.map((memberInitialValue:any) => {
      const arrayMemberId = generateRandomString(4);
      const initMemberFactory = memberFactory(arrayMemberId, memberInitialValue);
      const arrayMemberRootPath = generateFullPath(arrayMemberId, arrayPath);
      const { children } = generateChildren([initMemberFactory], arrayPath);
      return { children, arrayMemberRootPath };
    });

    const childrenCollected = res.reduce((acc:any, { children }:any) => {
      acc = { ...acc, ...children };
      return acc;
    }, {});

    const arrayMemberRootPaths = res.reduce((acc:any, { arrayMemberRootPath }:any) => {
      acc = acc.concat(arrayMemberRootPath);
      return acc;
    }, []);
    return {
      [arrayPath]: {
        id: arrayPath,
        type: EFormTypes.ARRAY,
        errors: [],
        showError: false,
        touched: false,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        isRequiredField: true,
        children: arrayMemberRootPaths,
        initMembers: memberFactory,
      },
      ...childrenCollected,
    };
  };
}

export function validationGroup<T extends TFormData>({
  path,
  validations,
  childrenFactories,
}:any
): (parentPath?: any) => T {
  return function (parentPath?: any) {
    const fullPath = generateFullPath(path, parentPath);
    const { children, childrenPaths } = generateChildren(childrenFactories, fullPath);

    return {
      [fullPath]: {
        id: fullPath,
        type: EFormTypes.VALIDATION_GROUP as const,
        children: childrenPaths,
        errors: [],
        showError: false,
        isRequiredField: true,
        touched: false,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
      },
      ...children,
    };
  } as any;
}

export function oneOf({
  path,
  switcherOptions,
  variants,
}: any) {
  return function (parentPath?: any) {
    const fullPath = generateFullPath(path, parentPath);

    const variantFormData = Object.entries(variants).reduce((acc:any, [key, variant]:any):any => {
      const childrenFactories = [
        selectTag({
          path: switcherOptions.path,
          value: key,
          isRequiredField: true,
          validations: [],
          options: switcherOptions.options,
          parentPath,
        }),
        ...variant.children,
      ];
      acc[key] = generateChildren(childrenFactories, fullPath);
      return acc;
    }, {});

    return {
      [fullPath]: {
        id: fullPath,
        type: EFormTypes.ONE_OF as const,
        children: variantFormData[switcherOptions.value].childrenPaths,
        variants: variantFormData,
        value: switcherOptions.value,
        errors: [],
        showError: false,
        isRequiredField: true,
        touched: false,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
      },
      ...variantFormData[switcherOptions.value].children,
    };
  };
}

export function textField({ path, value }:{path:string, value: string}) {
  return function (parentPath?: string) {
    const fullPath = generateFullPath(path, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.TEXT_FIELD as const,
        id: fullPath,
        children: [],
        isRequiredField: true,
        validations: [],
        value,
      },
    };
  };
}

export function textInput({
  id,
  value,
  isRequiredField,
  validations,
}:{id: string,value: string, isRequiredField:boolean, validations: TValidationFn[]}):(parentId?: string) => {[fullPath:string]:TTextInputData} {
  return function (parentId) {
    const fullPath = generateFullPath(id, parentId);
    return {
      [fullPath]: {
        type: EFormTypes.TEXT_INPUT as const,
        id: fullPath,
        errors: [],
        showError: false,
        touched: false,
        value,
        isRequiredField,
        children: [],
        validations,
      },
    };
  };
}

export function numericInput({
  path,
  value,
  isRequiredField,
  validations,
}: {
  path: string;
  value: string;
  isRequiredField: boolean;
  validations: ((id: string, data:TFormData) => undefined | string)[];
}) {
  return function (parentPath?: string) {
    const fullPath = generateFullPath(path, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.INTEGER_INPUT as const,
        id: fullPath,
        children: [],
        errors: [],
        isMandatory: false,
        showError: false,
        touched: false,
        isRequiredField,
        value,
        validations,
      },
    };
  };
}

export function select({
  path,
  value,
  isRequiredField,
  options,
  validations,
}: any) {
  return function (parentPath?: any) {
    const fullPath = generateFullPath(path, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.SELECT as const,
        id: fullPath,
        errors: [],
        showError: false,
        touched: false,
        value,
        isRequiredField,
        children: [],
        options,
        validations,
      },
    };
  };
}

export function selectTag({
  path,
  value,
  isRequiredField,
  options,
  validations,
}: {
  path: string;
  value: string;
  isRequiredField: boolean;
  parentPath: string;
  options: { key: string; label: string }[];
  validations: ((id: string, data:TFormData) => undefined | string)[];
}) {
  return function (parentPath?: string) {
    const fullPath = generateFullPath(path, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.SELECT_TAG as const,
        id: fullPath,
        errors: [],
        showError: false,
        touched: false,
        parentPath,
        value,
        isRequiredField,
        children: [],
        options,
        validations,
      },
    };
  };
}

function generateFullPath(path: string, parentPath?: string): string {
  return parentPath ? `${parentPath}.${path}` : path;
}

export function generateChildren<T extends TFormData>(childrenFactories:Array<(parentId?: string)=>T>, fullPath:string):{children: TFormData,childrenPaths: string[]} {
  return childrenFactories.reduce(
    (acc:any, childFactory:any) => {
      const child = childFactory(fullPath);
      const childPath = Object.keys(child)[0];
      return {
        children: {
          ...acc.children,
          ...child,
        },
        childrenPaths: [...acc.childrenPaths, childPath],
      };
    },
    { children: {}, childrenPaths: [] },
  ) as any
}
