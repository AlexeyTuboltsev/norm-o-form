import { EFormTypes, TFormGenerator, TValidationFn } from './types';
import { childrenAreValid } from './validators';
import { createChildrenGenerators, generateFullPath, generateRandomString } from './utils';


export function formRoot({ formId, validations, children }:
  { formId: string, validations: TValidationFn, children: Array<(parentId: string) => TFormGenerator> }
): TFormGenerator {
  const { children: childNodes, childrenPaths } = createChildrenGenerators(children, formId);

  return {
    [formId]: {
      type: EFormTypes.ROOT as const,
      id: formId,
      lookupPath: formId,
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
  }
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

export function validationGroup({
    path,
    validations,
    children,
  }: { path: string, validations: TValidationFn[], children: Array<(parentId: string) => TFormGenerator> }
): (parentPath: string) => TFormGenerator {
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
  }
}

export function oneOf({
  path,
  initialValue,
  switcherOptions,
  variants,
}: { path: string, initialValue: string, switcherOptions: any, variants: { [key: string]: { children: any[] } } }) {
  return function (parentPath: string): TFormGenerator {
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
        type: EFormTypes.ONE_OF as const,
        id: fullPath,
        lookupPath: fullPath,
        initialValue,
        children: childrenPaths,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
        generate: ({ value }: { value: string }) => ({
          type: EFormTypes.ONE_OF as const,
          id: fullPath,
          value,
          lookupPath: fullPath,
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
}: { id: string, initialValue: string, isRequiredField: boolean, validations: TValidationFn[] }) {
  return function (parentId:string):TFormGenerator {
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
  validations: Array<TValidationFn>;
}) {
  return function (parentPath: string):TFormGenerator {
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
}: {
  path: string;
  initialValue: string;
  isRequiredField: boolean;
  options: { key: string; label: string }[];
  validations: Array<TValidationFn>;
}) {
  return function (parentPath: string):TFormGenerator {
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


