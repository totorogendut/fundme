export declare enum FundType {
    isSingle = "single",
    isMultiple = "multiple",
    isDefault = "default",
    isFromTemplate = "template",
    isUndefined = "undefined"
}
export declare function fund(pointer?: WMAddress, options?: fundOptions): FundType | string;
