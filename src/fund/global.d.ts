type WMAddress = string | Array<string | WMPointer> | undefined;

interface WMPointer {
  address: string;
  weight: number;
}

interface fundOptions {
  maxPool?: number;
  default?: boolean;
}

// declare var document: any;
// declare var window: any;