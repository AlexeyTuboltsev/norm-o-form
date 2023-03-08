import { filter } from "../src/utils";

describe("filter", () => {
  test("works", () => {
    const input = new Map([["a", 1], ["b", 2], ["c", 3], ["toExclude", 4]])
    const expectedOutput = new Map([["a", 1], ["b", 2], ["c", 3]])
    const filterBy = ([_k, v]: [any, any]) => [1, 2, 3].includes(v)


    expect(filter(input, filterBy)).toEqual(expectedOutput)
  })
})