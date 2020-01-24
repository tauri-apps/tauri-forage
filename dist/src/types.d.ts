export declare type Empty = null | void;
export declare type MaybeFunction = (val: any) => any | Empty;
export declare type MaybeUint8Array = Uint8Array | Empty;
export interface Purifiable {
    model?: any[];
    maxLen?: number;
}
