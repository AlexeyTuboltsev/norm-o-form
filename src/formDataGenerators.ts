import { EFormTypes, TFormGenerator, TValidationFn } from './types';
import { childrenAreValid } from './validators';
import { createChildrenGenerators, generateFullPath } from './utils';

export const arrayMemberKey = "<arrayMember>"

export function formRoot({ formId, validations, children }:
  { formId: string, validations: TValidationFn, children: Array<(parentId: string) => TFormGenerator> }
): TFormGenerator {
  const { children: childNodes, childrenPaths } = createChildrenGenerators(children, formId);

  return {
    [formId]: {
      type: EFormTypes.ROOT as const,
      id:formId,
      path: formId,
      children: childrenPaths,
      getValue: <T>(initialValues: T) => initialValues,
      validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
      generate: () => ({
        type: EFormTypes.ROOT as const,
        path: formId,
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

export function validationGroup({
    id:generatorId,
    validations,
    children,
  }: { id: string, validations: TValidationFn[], children: Array<(parentId: string) => TFormGenerator> }
): (parentPath: string) => TFormGenerator {
  return function (parentGeneratorPath: string) {
    const fullGeneratorPath = generateFullPath(generatorId, parentGeneratorPath);
    const { children: childrenGenerators, childrenPaths } = createChildrenGenerators(children, fullGeneratorPath);

    return {
      [fullGeneratorPath]: {
        type: EFormTypes.VALIDATION_GROUP as const,
        path: fullGeneratorPath,
        id:generatorId,
        children: childrenPaths,
        getValue: <T>(initialValues: T) => initialValues, //pass through in container nodes
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        generate: ({ path }: { path: string }) => ({
          type: EFormTypes.VALIDATION_GROUP as const,
          path,
          lookupPath:fullGeneratorPath,
          children: childrenPaths,
          isRequiredField: true,
          errors: [],
          touched: false,
          showError: false,
        })
      },
      ...childrenGenerators,
    };
  }
}

export function array({
  id:generatorId,
  validations,
  arrayMember: arrayMemberData,
  getValue
}: { id: string, validations: TValidationFn[], arrayMember: any, getValue: (initialValues: any) => any[] }) {
  return function (parentGeneratorPath: string): TFormGenerator {
    const fullGeneratorPath = generateFullPath(generatorId, parentGeneratorPath);

    const { children, childrenPaths } = createChildrenGenerators(
      [
        arrayMember({
          id: arrayMemberKey,
          children: arrayMemberData.children,
          validations: arrayMemberData.validations,
        })],
      fullGeneratorPath);

    return {
      [fullGeneratorPath]: {
        type: EFormTypes.ARRAY,
        path: fullGeneratorPath,
        id:generatorId,
        children: childrenPaths,
        getValue,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        generate: ({ childrenPaths, path }: { childrenPaths: string[], path: string }) => ({
          path,
          lookupPath:fullGeneratorPath,
          type: EFormTypes.ARRAY,
          children: childrenPaths,
          isRequiredField: true,
          showError: false,
          touched: false,
          errors: []
        }),
      },
      ...children
    };
  }
}

export function arrayMember({
    id:generatorId,
    validations,
    children,
  }: { id: string, validations: TValidationFn[], children: Array<(parentId: string) => TFormGenerator> }
): (parentPath: string) => TFormGenerator {
  return function (parentGeneratorPath: string) {
    const fullGeneratorPath = generateFullPath(generatorId, parentGeneratorPath);
    const { children: childrenNodes, childrenPaths } = createChildrenGenerators(children, fullGeneratorPath);

    return {
      [fullGeneratorPath]: {
        type: EFormTypes.ARRAY_MEMBER as const,
        path: fullGeneratorPath,
        id:generatorId,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        children: childrenPaths,
        getValue: <T>(initialValues: T) => initialValues, //pass through in container nodes
        generate: ({ path, childrenPaths }: { childrenPaths: string[], path: string }) => ({
          type: EFormTypes.ARRAY_MEMBER as const,
          path,
          lookupPath: fullGeneratorPath,
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
  id:generatorId,
  getValue,
  switcherOptions,
  variants,
}: { id: string, getValue: (initialValues: any) => string, switcherOptions: any, variants: { [key: string]: { children: any[] } } }) {
  return function (parentGeneratorPath: string): TFormGenerator {
    const fullGeneratorPath = generateFullPath(generatorId, parentGeneratorPath);

    const wrapVariantInValidationGroup = (key: string, variant: any) => validationGroup({
      id: key,
      validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
      children: variant.children
    })

    const { childrenPaths, children } = createChildrenGenerators(
      Object.entries(variants)
        .map(([key, variant]) => wrapVariantInValidationGroup(key, variant)) as any,
      fullGeneratorPath
    )

    const variantChildrenPaths = Object.entries(variants).reduce((acc: any, [key, variant]) => {
      const variantChildren = [wrapVariantInValidationGroup(key, variant)]
      acc[key] = createChildrenGenerators(variantChildren as any, fullGeneratorPath).childrenPaths
      return acc
    }, {})

    return {
      [fullGeneratorPath]: {
        type: EFormTypes.ONE_OF as const,
        path: fullGeneratorPath,
        id:generatorId,
        children: childrenPaths,
        getValue,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
        generate: ({ value, path }: { value: string, path: string }) => ({
          type: EFormTypes.ONE_OF as const,
          path,
          value,
          lookupPath: fullGeneratorPath,
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
  id: generatorId,
  getValue,
  isRequiredField,
  validations,
}: { id: string, getValue: (initialValues: any) => string, isRequiredField: boolean, validations: TValidationFn[] }) {
  return function (parentGeneratorPath: string): TFormGenerator {
    const fullGeneratorPath = generateFullPath(generatorId, parentGeneratorPath);
    return {
      [fullGeneratorPath]: {
        type: EFormTypes.TEXT_INPUT as const,
        path: fullGeneratorPath,
        id: generatorId,
        children: [],
        getValue,
        validations,
        generate: ({ value, path }: { value: string, path: string }) => ({
          type: EFormTypes.TEXT_INPUT as const,
          path,
          lookupPath: fullGeneratorPath,
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
  id: generatorId,
  getValue,
  isRequiredField,
  validations,
}: {
  id: string;
  getValue: (initialValues: any) => string;
  isRequiredField: boolean;
  validations: Array<TValidationFn>;
}) {
  return function (parentGeneratorPath: string): TFormGenerator {
    const fullGeneratorPath = generateFullPath(generatorId, parentGeneratorPath);
    return {
      [fullGeneratorPath]: {
        type: EFormTypes.INTEGER_INPUT as const,
        path: fullGeneratorPath,
        id: generatorId,
        children: [],
        getValue,
        validations,
        generate: ({ value, path }: { value: string, path: string }) => ({
          type: EFormTypes.INTEGER_INPUT as const,
          path,
          lookupPath: fullGeneratorPath,
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
  id:generatorId,
  getValue,
  isRequiredField,
  options,
  validations,
}: {
  id: string;
  getValue: (initialValues: any) => string;
  isRequiredField: boolean;
  options: { key: string; label: string }[];
  validations: Array<TValidationFn>;
}) {
  return function (parentGeneratorPath: string): TFormGenerator {
    const fullGeneratorPath = generateFullPath(generatorId, parentGeneratorPath);
    return {
      [fullGeneratorPath]: {
        type: EFormTypes.SELECT as const,
        path: fullGeneratorPath,
        id:generatorId,
        children: [],
        getValue,
        validations,
        generate: ({ value, path }: { value: string, path: string }) => ({
          type: EFormTypes.SELECT as const,
          path ,
          lookupPath:fullGeneratorPath,
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


