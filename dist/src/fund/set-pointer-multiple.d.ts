export declare const DEFAULT_WEIGHT: number;
export declare function setPointerMultiple(pointers: Array<string | WMPointer>, maxPool?: number): void;
export declare function getPointerAddress(pointer: WMPointer): string;
export declare function createPool(pointers: Array<string | WMPointer>): WMPointer[];
export declare function checkWeight(pointer: WMPointer): WMPointer;
export declare function pickPointer(pointers: WMPointer[]): WMPointer;
export declare function getChoice(sum: number): number;
export declare function convertToPointer(str: string): WMPointer;
