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
      // id:formId,
      path: formId,
      lookupPath: formId,
      children: childrenPaths,
      getValue: <T>(initalValues:T)=>initalValues,
      validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
      generate: () => ({
        type: EFormTypes.ROOT as const,
        // id: formId,
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
    id,
    validations,
    children,
  }: { id: string, validations: TValidationFn[], children: Array<(parentId: string) => TFormGenerator> }
): (parentPath: string) => TFormGenerator {
  return function (parentPath: string) {
    const fullPath = generateFullPath(id, parentPath);
    const { children: childrenGenerators, childrenPaths } = createChildrenGenerators(children, fullPath);

    return {
      [fullPath]: {
        path: fullPath,
        type: EFormTypes.VALIDATION_GROUP as const,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        children: childrenPaths,
        getValue: <T>(initialValues:T) => initialValues,
        generate: ({lookupPath}:{lookupPath:string}) => ({
          type: EFormTypes.VALIDATION_GROUP as const,
          path: fullPath,
          lookupPath,
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

//----- formGenerator------
//root children=[root.array]
//root.array children=[root.array.<member>]
//root.array.<member>  children=[root.array.<member>.name, root.array.<member>.album]
//root.array.<member>.name
//root.array.<member>.album

//---------formData----------------
//root children=[root.array]
//root.array children=[root.array.<23wsfd>,root.array.<wefzxfd>,root.array.<6thbcs>]
//root.array.<23wsfd>  children=[root.array.<23wsfd>.name, root.array.<23wsfd>.album]
//root.array.<23wsfd>.name
//root.array.<23wsfd>.album
//root.array.<wefzxfd>  children=[root.array.<wefzxfd>.name, root.array.<wefzxfd>.album]
//root.array.<wefzxfd>.name
//root.array.<wefzxfd>.album
//root.array.<6thbcs>  children=[root.array.<6thbcs>.name, root.array.<6thbcs>.album]
//root.array.<6thbcs>.name
//root.array.<6thbcs>.album


export function array({ id, validations, arrayMember: arrayMemberData, getValue }: {id:string, validations: TValidationFn[], arrayMember: any, getValue: (initialValues:any)=> any[]}) {
  return function (parentPath: string): TFormGenerator {
    const arrayPath = generateFullPath(id, parentPath);

    const { children, childrenPaths } = createChildrenGenerators(
      [
        arrayMember({
          id: arrayMemberKey,
          children: arrayMemberData.children,
          validations: arrayMemberData.validations,
        })],
      arrayPath);

    return {
      [arrayPath]: {
        path: arrayPath,
        type: EFormTypes.ARRAY,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        children: childrenPaths,
        getValue,
        generate: ({ children, lookupPath }: { children:string[], lookupPath:string }) => ({
          path: arrayPath,
          lookupPath,
          type: EFormTypes.ARRAY,
          children: children,
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
    id,
    validations,
    children,
  }: { id: string, validations: TValidationFn[], children:  Array<(parentId: string) => TFormGenerator> }
): (parentPath: string) => TFormGenerator {
  return function (parentPath: string) {
    const fullPath = generateFullPath(id, parentPath);
    const { children: childrenNodes, childrenPaths } = createChildrenGenerators(children, fullPath);

    return {
      [fullPath]: {
        path: fullPath,
        type: EFormTypes.ARRAY_MEMBER as const,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })].concat(validations),
        children: childrenPaths,
        getValue: <T>(initialValues:T) => initialValues,
        generate: ({ path, childrenPaths }:{childrenPaths:string[], path:string}) => ({
            type: EFormTypes.ARRAY_MEMBER as const,
            path: path,
            lookupPath:fullPath,
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
  getValue,
  switcherOptions,
  variants,
}: { path: string, getValue: (initialValues:any) => string, switcherOptions: any, variants: { [key: string]: { children: any[] } } }) {
  return function (parentPath: string): TFormGenerator {
    const fullPath = generateFullPath(path, parentPath);

    const wrapVariantInValidationGroup = (key: string, variant: any) => validationGroup({
      id: key,
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
        path: fullPath,
        getValue,
        children: childrenPaths,
        validations: [childrenAreValid({ errorMessage: 'some fields are invalid' })],
        generate: ({ value,lookupPath}: { value: string,lookupPath:string }) => ({
          type: EFormTypes.ONE_OF as const,
          path: fullPath,
          value,
          lookupPath,
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
  getValue,
  isRequiredField,
  validations,
}: { id: string, getValue: (initialValues:any) => string, isRequiredField: boolean, validations: TValidationFn[] }) {
  return function (parentId: string): TFormGenerator {
    const fullPath = generateFullPath(id, parentId);
    return {
      [fullPath]: {
        type: EFormTypes.TEXT_INPUT as const,
        path: fullPath,
        getValue,
        validations,
        id,
        children: [],
        generate: ({ value,lookupPath}: { value: string,lookupPath:string }) => ({
          type: EFormTypes.TEXT_INPUT as const,
          path: fullPath,
          lookupPath,
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
  getValue,
  isRequiredField,
  validations,
}: {
  path: string;
  getValue: (initialValues:any) => string;
  isRequiredField: boolean;
  validations: Array<TValidationFn>;
}) {
  return function (parentPath: string): TFormGenerator {
    const fullPath = generateFullPath(path, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.INTEGER_INPUT as const,
        path: fullPath,
        getValue,
        validations,
        children: [],
        generate: ({ value,lookupPath}: { value: string,lookupPath:string }) => ({
          type: EFormTypes.INTEGER_INPUT as const,
          path: fullPath,
          lookupPath,
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
  id,
  getValue,
  isRequiredField,
  options,
  validations,
}: {
  id: string;
  getValue: (initialValues:any) => string;
  isRequiredField: boolean;
  options: { key: string; label: string }[];
  validations: Array<TValidationFn>;
}) {
  return function (parentPath: string): TFormGenerator {
    const fullPath = generateFullPath(id, parentPath);
    return {
      [fullPath]: {
        type: EFormTypes.SELECT as const,
        path: fullPath,
        getValue,
        validations,
        children: [],
        generate: ({ value,lookupPath}: { value: string,lookupPath:string }) => ({
          type: EFormTypes.SELECT as const,
          path: fullPath,
          lookupPath,
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


