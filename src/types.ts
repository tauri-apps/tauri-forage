export type Empty = null | void

export type MaybeFunction = (val: any) => any | undefined

export type MaybeUint8Array = Uint8Array | Empty

export interface Encryptable {
  json?: object
  key?: string
}

export interface Decryptable {
  msg?: string
  key?: string
}

export interface EncryptableBox {
  json: object
  key: string
  secretOrSharedKey: string
}

export interface DecryptableBox {
  secretOrSharedKey: string
  messageWithNonce: string
  key: string
}

export interface Purifiable {
  model?: any[]
  maxLen?: number
}