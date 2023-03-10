export type GetReturnType<T extends {[key:string]:any}> = {[I in keyof T]: ReturnType<T[I]>}[keyof T]
export type GetObjectPropertyType<T extends {[key:string]:any}> = {[I in keyof T]: GetReturnType<T[I]>}[keyof T]


export function cleanupCode(input:string){
  const re = new RegExp(/\(\d,norm_o_form__WEBPACK_IMPORTED_MODULE_0__\.(.+)\)/gm)
  return input.replace(re, "$1")
}
export function replacer(key:string,value:any){
  if (typeof value === 'function' && value.name == "generate" ){
    return "generate()"
  } else if ((typeof value === 'function' && value.name == "getValue")) {
    return 'getValue()'
  } else if (typeof value === 'function'){
    return "function"
  } else {
    return value
  }
}