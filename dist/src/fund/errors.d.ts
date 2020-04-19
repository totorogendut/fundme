export declare function FundmeError(err: string): string;
export declare const addressNotFound = "address not found.";
export declare const addressIsNotAString = "address must be a string.";
export declare const getCurrentPointerAddressMustClientSide = "can't use getCurrentPointerAddress() server-side.";
export declare const weightNotFound = "entries .weight not found.";
export declare function weightIsNotANumber(str: string): string;
export declare const invalidAddress = "invalid Web Monetization pointer address is given.";
export declare const defaultAddressNotFound = "default address not found. Use setDefaultAddress(str: string) to set it first.";
export declare const invalidDefaultAddress = "invalid default address.";
export declare const defaultAddressArrayCannotBeEmpty = "invalid default address.";
export declare const canOnlyCleanStringCustomSyntax = "can only clean custom syntax with typeof string.";
export declare const metaTagNotFound = "web monetization meta tag is not found.";
export declare const metaTagMultipleIsFound = "multiple <meta name=\"monetization\" /> found - Web Monetization API only support a single meta tag.";
export declare const noTemplateFound = "no monetization template is found.";
export declare const failParsingTemplate = "fails to parse address from <template data-fund></template>.";
export declare const templateSinglePointerHasWeight = "found single <template data-fund></template> but has weight - only address will be parsed.";
export declare const cannotParseScriptJson = "cannot parse JSON from <script fundme>. Make sure it contains a valid JSON.";
export declare const jsonTemplateIsInvalid = "found <script fundme> but it's not valid.";
export declare const scriptFundmeIsNotApplicationJson = "found <script fundme> but its type is not \"application/json\"";
/*****************************
 *                           *
 *  Server-side fund()       *
 *                           *
 *****************************/
export declare const noUndefinedFundOnServerSide = "can't use fund() with empty parameters in server side.";
export declare const invalidFundmeServerSide = "invalid fundme parameters on the server-side.";
