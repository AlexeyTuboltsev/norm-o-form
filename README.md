# Norm-O-Form
_Under active development_

A declarative and type safe form validation framework for react/redux. 
Aims to simplify handling of validation of complex forms, including cross-validation and conditional validation of form blocks, at the same time allowing for a nice UX

### Rationale

In most popular front end form libraries validation seems to be an afterthought. They help a developer by wrapping html inputs in nicer and more developer-friendly components. Validation is exepcted to be done via yup, joi and the likes. 
The problem is that these libraries expect a static object to return a set of errors. In reality filling out a from should be a dynamic UX experience for the user, where the errors and different behaviours of the form are meant as aide for the user, guiding them through the process. Often different validations for onChange, onBlur and onPaste events are necessary, it should be possible to change/hide entire sections of the form (and respective validations) depending on user input, dynamic cross-field validations should not be a pain. For sure this can be done with usual validation tools too, but code for validation of any non-trivial form quickly becomes a huge mess of conditionals and imperative programming. The purpose of this library is to create a set of utilities that simplify coding of complex validations and UX behaviours.   


## How does it work
We model a form as a tree-like structure where each ancestor is only valid if all children are valid. In addition, each ancestor can have an own validation function applied to itself and its children (E.g. an array validation can check if there are at least 5 but no more than 9 members of an array of inputs, but only after all array members are proved valid). Each validation starts by an event from the respective input and goes upwards through the ancestor hierarchy. This way we achieve a linear and predictable validation flow, at the same time allowing for cross-validations of any kind. We can also define different validations and input value transformations for different events.   

the initial form definition function is for user's convenience.  
`generateForm()` transforms it to a "formGenerator" - a flat dictionary where keys are dot-separated IDs of the parent tree and values are objects with data necessary to generate serializable form data that is subsequently persisted in redux (or possibly any other storage mechanism):
```
{
"root":{
    type: "root"
    children: ["root.a", "root.b", "root.c"],
    validations: [...functions],
    behaviors: [...functions],
    ...
    },
"root.a"    {
    type: array,
    validations: [...functions],
    behaviors: [...functions],
    children: [],
    memberGenerator: (initalValue)=> member
    ...
    },
"root.b": {
    type: numericInput,
    validations: [...functions],
    behaviors: [...functions],
    value: "3"
    },
"root.c": { 
    type: "validationGroup",
    children: ["root.c.foo", "root.c.bar"],
    validations: [...functions],
    behaviors: [...functions],
    },
"root.c.foo": {
    type: booleanInput,
    validations: [...functions],
    behaviors: [...functions],
    value: "not_yet_set" // [-],
    ...
    },
"root.c.bar":{
    type: selectInput,
    validations: [...functions],
    behaviors: [...functions],
    value: "",
    options: [...]
    ...
    },
}

```

We define two recursive operations on this tree: `mapParentTree()` and `rebuildSubtree()`

Validation: `mapParentTree(formGenerator, id, formData)`. From given id walk upward to root, transforming each node via functions found in formGenerator by respective ID.

Transformation: (Add/Delete member of an array, select a different form block in oneOf): `rebuildSubtree(formGenerator, id, formData)` from given id find a function in formGenerator which would generate the new subtree.

The `formData` is then persisted in redux and can be consumed by form components by respective IDs. On each focus/change/blur/paste an action with an ID and value of the input is dispatched. (TODO debounce for text inputs, a set of helper components and hooks)  


