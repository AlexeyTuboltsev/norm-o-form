export type GetReturnType<T extends {[key:string]:any}> = {[I in keyof T]: ReturnType<T[I]>}[keyof T]
export type GetObjectPropertyType<T extends {[key:string]:any}> = {[I in keyof T]: GetReturnType<T[I]>}[keyof T]


