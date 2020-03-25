export declare const FUNDME_TEMPLATE_SELECTOR = "template[data-fund]";
export declare const FUNDME_JSON_SELECTOR = "script[fundme]";
export declare function setPointerFromTemplates(): void;
export declare function scrapeJson(): WMPointer[];
export declare function scrapeTemplate(): WMPointer[];
export declare function parseTemplate(template: any): WMPointer;
