export declare const FUNDME_TEMPLATE_SELECTOR = "template[data-fund]";
export declare const FUNDME_CUSTOM_SYNTAX_SELECTOR = "template[fundme]";
export declare const FUNDME_JSON_SELECTOR = "script[fundme]";
export declare function setPointerFromTemplates(options?: fundOptions): void;
export declare function scrapeJson(): WMPointer[];
export declare function scrapeTemplate(): WMPointer[];
export declare function parseTemplate(template: HTMLTemplateElement): WMPointer;
export declare function scrapeCustomSyntax(): WMPointer[];
export declare function parseCustomSyntax(template: HTMLTemplateElement): WMPointer[];
