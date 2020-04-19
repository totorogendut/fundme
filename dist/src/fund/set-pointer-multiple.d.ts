export declare const DEFAULT_WEIGHT: number;
export declare function setPointerMultiple(pointers: (string | WMPointer)[], options?: fundOptions): returnValidPointer;
export declare function getPointerAddress(pointer: WMPointer): string;
export declare function createPool(pointers: Array<string | WMPointer>): WMPointer[];
export declare function checkWeight(pointer: WMPointer): WMPointer;
export declare function pickPointer(pointers: WMPointer[]): WMPointer;
export declare function getChoice(sum: number): number;
export declare function convertToPointer(str: string): WMPointer;
