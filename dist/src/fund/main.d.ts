export declare let defaultAddress: WMAddress;
export declare let currentPointer: WMAddress;
export declare enum FundType {
    isSingle = "single",
    isMultiple = "multiple",
    isDefault = "default",
    isFromTemplate = "template",
    isUndefined = "undefined"
}
export declare function fund(pointer?: WMAddress, options?: fundOptions): FundType;
export declare function setDefaultAddress(address: WMAddress): void;
export declare function setCurrentPointer(pointer: string | WMPointer[]): void;
export declare function getCurrentPointerAddress(): string;
export declare function getCurrentPointerPool(): Array<string | WMPointer>;
