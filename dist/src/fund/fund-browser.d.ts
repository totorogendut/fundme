import { FundType } from './fund';
export declare function clientSideFund(pointer?: WMAddress, options?: fundOptions): FundType;
export declare function forceFundmeOnBrowser(): void;
export declare const isBrowser: (options?: fundOptions) => boolean;
