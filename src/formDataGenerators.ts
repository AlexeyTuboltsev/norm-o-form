import { EFormTypes, TFormData, TValidationFn } from './types';
import { childrenAreValid } from './validators';
import { generateRandomString } from './utils';


export function formRoot<T extends TFormData>({ formId, validations, children }:
  { formId: string, validations: TValidationFn, children: Array<(parentId: string) => TFormData> }
): T {
  const { children: childNodes, childrenPaths } = createChildrenGenerators(children, formId);

  return {
    [formId]: {
      id: formId,
      lookupPath: formId,
      type: EFormTypes.ROOT as const,
      children: childrenPaths,
      validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
      generate: () => ({
        type: EFormTypes.ROOT as const,
        id: formId,
        lookupPath: formId,
        touched: false,
        showError: false,
        errors: [],
        isRequiredField: true,
        children: childrenPaths
      }),
    },
    ...childNodes,
  } as any;
}

//todo
export function array({ path, validations, memberFactory, value }: any) {
  return function (parentPath: string) {
    const arrayPath = generateFullPath(path, parentPath);

    const res = value.map((memberInitialValue: any) => {
      const arrayMemberId = generateRandomString(4);
      const initMemberFactory = memberFactory(arrayMemberId, memberInitialValue);
      const arrayMemberRootPath = generateFullPath(arrayMemberId, arrayPath);
      const { children } = createChildrenGenerators([initMemberFactory], arrayPath);
      return { children, arrayMemberRootPath };
    });

    const childrenCollected = res.reduce((acc: any, { children }: any) => {
      acc = { ...acc, ...children };
      return acc;
    }, {});

    const arrayMemberRootPaths = res.reduce((acc: any, { arrayMemberRootPath }: any) => {
      acc = acc.concat(arrayMemberRootPath);
      return acc;
    }, []);
    return {
      [arrayPath]: {
        id: arrayPath,
        lookupPath: arrayPath,
        type: EFormTypes.ARRAY,
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
    children,
  }: { path: string, validations: TValidationFn[], children: Array<(parentId: string) => TFormData> }
): (parentPath: string) => T {
  return function (parentPath: string) {
    const fullPath = generateFullPath(path, parentPath);
    const { children: childrenNodes, childrenPaths } = createChildrenGenerators(children, fullPath);

    return {
      [fullPath]: {
        id: fullPath,
        lookupPath: fullPath,
        type: EFormTypes.VALIDATION_GROUP as const,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        children: childrenPaths,
        generate: () => ({
          type: EFormTypes.VALIDATION_GROUP as const,
          id: fullPath,
          lookupPath: fullPath,
          children: childrenPaths,
          isRequiredField: true,
          errors: [],
          touched: false,
          showError: false,
        })
      },
      ...childrenNodes,
    };
  } as any;
}

export function oneOf({
  path,
  initialValue,
  switcherOptions,
  variants,
}: { path: string, initialValue: string, switcherOptions: any, variants: { [key: string]: { children: any[] } } }) {
  return function (parentPath: string) {
    const fullPath = generateFullPath(path, parentPath);

    const wrapVariantInValidationGroup = (key: string, variant: any) => validationGroup({
      path: key,
      validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
      children: variant.children
    })

    const { childrenPaths, children } = createChildrenGenerators(
      Object.entries(variants)
        .map(([key, variant]) => wrapVariantInValidationGroup(key, variant)) as any,
      fullPath
    )

    const variantChildrenPaths = Object.entries(variants).reduce((acc: any, [key, variant]) => {
      const variantChildren = [wrapVariantInValidationGroup(key, variant)]
      acc[key] = createChildrenGenerators(variantChildren as any, fullPath).childrenPaths
      return acc
    }, {})

    return {
      [fullPath]: {
        type: EFormTypes.SELECT_TAG as const,
        id: fullPath,
        lookupPath: fullPath,
        parentPath,
        initialValue,
        children: childrenPaths,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
        generate: ({ value }: { value: string }) => ({
          type: EFormTypes.SELECT_TAG as const,
          id: fullPath,
          value,
          lookupPath: fullPath,
          parentPath,
          isRequiredField: true,
          touched: false,
          showError: false,
          errors: [],
          options: switcherOptions.options,
          children: variantChildrenPaths[value]
        }),
      },
      ...children
    }
  };
}

export function textInput({
  id,
  initialValue,
  isRequiredField,
  validations,
}: { id: string, initialValue: string, isRequiredField: boolean, validations: TValidationFn[] }): (parentId?: string) => { [fullPath: string]:/*TTextInputData*/any } {
  return function (parentId) {
    const fullPath = generateFullPath(id, parentId);
    return {
      [fullPath]: {
        type: EFormTypes.TEXT_INPUT as const,
        id: fullPath,
        lookupPath: fullPath,
        initialValue,
        validations,
        children: [],
        generate: ({ value }: { value: string }) => ({
          type: EFormTypes.TEXT_INPUT as const,
          id: fullPath,
          lookupPath: fullPath,
          value,
          isRequiredField,
          touched: false,
          showError: false,
          errors: [],
          children: []
        }),
      },
    };
  };
}

export function numericInput({
  path,
  initialValue,
  isRequiredField,
  validations,
}: {
  path: string;
  initialValue: string;
  isRequiredField: boolean;
  validations: ((id: string, data: TFormData) => undefined | string)[];
}) {
  return function (parentPath?: string) {
    const fullPath = generateFullPath(path, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.INTEGER_INPUT as const,
        id: fullPath,
        lookupPath: fullPath,
        initialValue,
        validations,
        children: [],
        generate: ({ value, }: { value: string }) => ({
          type: EFormTypes.INTEGER_INPUT as const,
          id: fullPath,
          lookupPath: fullPath,
          value,
          touched: false,
          isRequiredField,
          showError: false,
          errors: [],
          children: []
        }),
      },
    };
  };
}

export function select({
  path,
  initialValue,
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
        lookupPath: fullPath,
        initialValue,
        validations,
        children: [],
        generate: ({ value }: { value: string }) => ({
          type: EFormTypes.SELECT as const,
          id: fullPath,
          lookupPath: fullPath,
          value,
          isRequiredField,
          touched: false,
          showError: false,
          errors: [],
          options,
          children: []
        }),
      },
    };
  };
}

export function selectTag({
  path,
  options,
  children,
  initialValue
}: {
  path: string;
  initialValue: string,
  children: Array<(parentId?: string) => TFormData>,
  options: { key: string; label: string }[];
  validations: ((id: string, data: TFormData) => undefined | string)[];
}) {
  return function (parentPath?: string) {
    const fullPath = generateFullPath(path, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.SELECT_TAG as const,
        id: fullPath,
        lookupPath: fullPath,
        parentPath,
        initialValue,
        children: children,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
        generate: ({ value }: { value: string }) => ({
          type: EFormTypes.SELECT_TAG as const,
          id: fullPath,
          value,
          lookupPath: fullPath,
          parentPath,
          isRequiredField: true,
          touched: false,
          showError: false,
          errors: [],
          options,
          children
        }),
      },
    };
  };
}

export function generateFullPath(path: string, parentPath?: string): string {
  return parentPath ? `${parentPath}.${path}` : path;
}

export function createChildrenGenerators<T extends TFormData>(childrenFactories: Array<(parentId: string) => T>, fullPath: string): { children: TFormData, childrenPaths: string[] } {
  return childrenFactories.reduce(
    (acc: any, childFactory: any) => {
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

