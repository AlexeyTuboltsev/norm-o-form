import { getFormRootId, getParentPath, getSwitcherPath, mapParentTree, removeSubtree } from "../src/utils";
import { TFormData } from "../src";


describe("getFormRootId()", () => {
  const rootId = 'oneOfExampleForm'
  const rootFormElement = {
    id: rootId,
    lookupPath: 'oneOfExampleForm',
    type: 'root',
    children: [
      'oneOfExampleForm.deviceId',
      'oneOfExampleForm.email',
      'oneOfExampleForm.appName',
      'oneOfExampleForm.appVersion',
      'oneOfExampleForm.myVariants'
    ],
    errors: [
      'some fields are invalid'
    ],
    showError: false,
    touched: true,
    isRequiredField: true
  }

  const testFormData = {
    'oneOfExampleForm.myVariants': {
      id: 'oneOfExampleForm.myVariants',
      lookupPath: 'oneOfExampleForm.myVariants',
      type: 'oneOf',
      children: [
        'oneOfExampleForm.myVariants.option1',
        'oneOfExampleForm.myVariants.option2'
      ],
      value: 'option1',
      errors: [
        'some fields are invalid'
      ],
      showError: false,
      isRequiredField: true,
      touched: true
    },
    'oneOfExampleForm.myVariants.option1': {
      id: 'oneOfExampleForm.myVariants.option1',
      lookupPath: 'oneOfExampleForm.myVariants.option1',
      type: 'validationGroup',
      children: [
        'oneOfExampleForm.myVariants.option1.switcher',
        'oneOfExampleForm.myVariants.option1.zzz'
      ],
      errors: [
        'some fields are invalid'
      ],
      showError: false,
      isRequiredField: true,
      touched: true
    },
    'oneOfExampleForm.myVariants.option1.switcher': {
      type: 'selectTag',
      id: 'oneOfExampleForm.myVariants.option1.switcher',
      lookupPath: 'oneOfExampleForm.myVariants.option1.switcher',
      errors: [],
      showError: false,
      touched: false,
      parentPath: 'oneOfExampleForm.myVariants.option1',
      value: 'option1',
      isRequiredField: true,
      children: [],
      options: [
        {
          key: 'option1',
          label: 'option1'
        },
        {
          key: 'option2',
          label: 'option2'
        }
      ]
    },
    'oneOfExampleForm.myVariants.option1.zzz': {
      type: 'textInput',
      id: 'oneOfExampleForm.myVariants.option1.zzz',
      lookupPath: 'oneOfExampleForm.myVariants.option1.zzz',
      errors: [
        'this is not a geo coordinate'
      ],
      showError: false,
      touched: true,
      value: 'zzz_valuexxxx',
      isRequiredField: false,
      children: []
    },
    'oneOfExampleForm.myVariants.option2': {
      id: 'oneOfExampleForm.myVariants.option2',
      lookupPath: 'oneOfExampleForm.myVariants.option2',
      type: 'validationGroup',
      children: [
        'oneOfExampleForm.myVariants.option2.switcher',
        'oneOfExampleForm.myVariants.option2.xxx1',
        'oneOfExampleForm.myVariants.option2.xxx2'
      ],
      errors: [],
      showError: false,
      isRequiredField: true,
      touched: true
    },
    'oneOfExampleForm.myVariants.option2.switcher': {
      type: 'selectTag',
      id: 'oneOfExampleForm.myVariants.option2.switcher',
      lookupPath: 'oneOfExampleForm.myVariants.option2.switcher',
      errors: [],
      showError: false,
      touched: true,
      parentPath: 'oneOfExampleForm.myVariants.option2',
      value: 'option2',
      isRequiredField: true,
      children: [],
      options: [
        {
          key: 'option1',
          label: 'option1'
        },
        {
          key: 'option2',
          label: 'option2'
        }
      ]
    },
    'oneOfExampleForm.myVariants.option2.xxx1': {
      type: 'textInput',
      id: 'oneOfExampleForm.myVariants.option2.xxx1',
      lookupPath: 'oneOfExampleForm.myVariants.option2.xxx1',
      errors: [],
      showError: false,
      touched: false,
      value: 'xxx1_val',
      isRequiredField: true,
      children: []
    },
    'oneOfExampleForm.myVariants.option2.xxx2': {
      type: 'textInput',
      id: 'oneOfExampleForm.myVariants.option2.xxx2',
      lookupPath: 'oneOfExampleForm.myVariants.option2.xxx2',
      errors: [],
      showError: false,
      touched: false,
      value: 'xsadf',
      isRequiredField: false,
      children: []
    }
  }


  test("finds the root form ID if it's there", () => {
    const formData = {
      [rootId]: rootFormElement,
      ...testFormData
    } as unknown as TFormData

    const result = getFormRootId(formData)
    expect(result).toEqual(rootId);
  })

  test("doesn't find the root form ID if it's not there", () => {
    const result = getFormRootId(testFormData as unknown as TFormData)
    expect(result).toBeUndefined()
  })
})

describe("getParentPath()", () => {
  test("it returns null on empty string", () => {
    expect(getParentPath("")).toEqual(null)
  })

  test("it returns null on string with one member", () => {
    expect(getParentPath("asd")).toEqual(null)
  })

  test("it returns everything except the last member on string with two or more members", () => {
    expect(getParentPath("a.b")).toEqual("a")
    expect(getParentPath("a.b.c")).toEqual("a.b")
  })
})

describe("getSwitcherPath()", () => {
  test("it returns null on empty string", () => {
    expect(getSwitcherPath("")).toEqual(null)
  })

  test("it returns null on string with one or two members", () => {
    expect(getSwitcherPath("a")).toEqual(null)
    expect(getSwitcherPath("a.b")).toEqual(null)
  })

  test("it returns everything except the last member on string with three or more members", () => {
    expect(getSwitcherPath("a.b.c")).toEqual("a")
    expect(getSwitcherPath("a.b.c.d")).toEqual("a.b")
  })
})

describe("iterateToRoot()", () => {
  const rootId = "rootId"

  const formGenerator = {
    [`${rootId}.a.b.c`]: { value: 45739 },
    [`${rootId}.a.b`]: { value: "xnvls" },
    [`${rootId}.a`]: { value: "388" },
    [`${rootId}`]: { value: NaN },
  }

  const formData = {
    [`${rootId}.a.b.c`]: { a: 28, value: 1 },
    [`${rootId}.a.b`]: { a: 3, value: 1 },
    [`${rootId}.a`]: { a: 33, value: 1 },
    [`${rootId}`]: { a: 17, value: 1 },
  }

  const resultingFormData = {
    [`${rootId}.a.b.c`]: { a: 28, value: 45739 },
    [`${rootId}.a.b`]: { a: 3, value: "xnvls" },
    [`${rootId}.a`]: { a: 33, value: "388" },
    [`${rootId}`]: { a: 17, value: NaN },
  }

  const startingId = `${rootId}.a.b.c`

  test("iterates from given id upwards to root and transforms each element", () => {
    const fieldTransformationFn = jest.fn((formGenerator, id, formData) => [{
      ...formData[id],
      value: formGenerator[id].value
    }, true])

    const result = mapParentTree(fieldTransformationFn as any, formGenerator as any, startingId, formData as any)
    expect(result).toEqual(resultingFormData)
    expect(fieldTransformationFn).toHaveBeenCalledTimes(4)
  })

  test("stops iteration", () => {

    const resultingFormData = {
      [`${rootId}.a.b.c`]: { a: 28, value: 45739 },
      [`${rootId}.a.b`]: { a: 3, value: "xnvls" },
      [`${rootId}.a`]: { a: 33, value: "388" },
      [`${rootId}`]: { a: 17, value: 1 },
    }

    const fieldTransformationFn = jest.fn((formGenerator, id, formData) => [{
      ...formData[id],
      value: formGenerator[id].value
    }, formGenerator[id].value !== "388"])

    const result = mapParentTree(fieldTransformationFn as any, formGenerator as any, startingId, formData as any)
    expect(result).toEqual(resultingFormData)
    expect(fieldTransformationFn).toHaveBeenCalledTimes(3)
  })
})

describe("removeSubtree", () => {

  test("removes subtree", () => {
    const tree = {
      "root": { children: ["root.a", "root.b"] },
      "root.a": { value: 'foo' },
      "root.b": { children: ["root.b.a", "root.b.b", "root.b.c"] },
      "root.b.a": { children: ["root.b.a.a"] },
      "root.b.a.a": {value: 23},

      "root.b.b": { value: 'bar' },
      "root.b.c": { children: [] },
    }
    expect(removeSubtree("root",tree as any)).toEqual({})

  })
  test("leaves the rest of the tree in place", () => {
    const tree = {
      "root": { children: ["root.a", "root.b"] },
      "root.a": { children:["root.a.a"] },
      "root.a.a": { value: 2 },
      "root.b": { children: ["root.b.a", "root.b.b", "root.b.c"] },
      "root.b.a": { children: ["root.b.a.a"] },
      "root.b.a.a": {value: 23},

      "root.b.b": { value: 'bar' },
      "root.b.c": { children: [] },
    }
    const resultingTree = {
      "root": { children: ["root.a", "root.b"] },
      "root.a": { children:["root.a.a"] },
      "root.a.a": { value: 2 },
    }

    expect(removeSubtree("root.b",tree as any)).toEqual(resultingTree)
  })
})