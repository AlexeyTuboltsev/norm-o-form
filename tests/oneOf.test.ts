import { oneOf } from "../src/formDataGenerators"
import { generateFullPath } from "../src/utils";

function testDummy({
  id,
}: { id: string }): (parentId?: string) => { [fullPath: string]:/*TTextInputData*/any } {
  return function (parentId) {
    const fullPath = generateFullPath(id, parentId);
    return {
      [fullPath]: {
        type: "dummy",
        id: fullPath,
        lookupPath: fullPath,
        generate: () => "dummy",
        validations: [],
      },
    };
  };
}

describe.skip("", () => {
  test("", () => {
    const oneOfGenerator = oneOf({
      id: 'myVariants',
      getValue: ()=>'bla',
      switcherOptions: {
        path: 'switcher',
        options: [{ key: "option1", label: "option1" }, { key: "option2", label: "option2" }],
      },
      variants: {
        "option1": {
          children: [
            testDummy({
              id: "input1"
            }),
            testDummy({
              id: "input2"
            }),
          ],
        },
        "option2": {
          children: [
            testDummy({
              id: "input3"
            }),
          ],
        },
      },
    })

    const result = oneOfGenerator("option2")
    expect(result).toEqual(
      expect.objectContaining({
          "option2.myVariants": {
            "generate": expect.any(Function),
            "id": "option2.myVariants",
            "lookupPath": "option2.myVariants",
            "regenerateVariants": expect.any(Function),
            "type": "oneOf",
            "validations": [expect.any(Function)]
          },
          "option2.myVariants.input1": {
            "generate": expect.any(Function),
            "id": "option2.myVariants.input1",
            "lookupPath": "option2.myVariants.input1",
            "type": "dummy",
            "validations": []
          },
          "option2.myVariants.input2": {
            "generate": expect.any(Function),
            "id": "option2.myVariants.input2",
            "lookupPath": "option2.myVariants.input2",
            "type": "dummy",
            "validations": []
          },
          "option2.myVariants.switcher": {
            "generate": expect.any(Function),
            "id": "option2.myVariants.switcher",
            "initialValue": "option1",
            "lookupPath": "option2.myVariants.switcher",
            "parentPath": "option2.myVariants",
            "type": "selectTag",
            "validations": []
          }
        }
      ))
  })
})



