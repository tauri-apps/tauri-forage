export type Empty = null | void

export type MaybeFunction = (val: any) => any | Empty

export type MaybeUint8Array = Uint8Array | Empty

export interface Purifiable {
  model?: any[]
  maxLen?: number
}