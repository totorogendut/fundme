type WMAddress = string | Array<string | WMPointer> | undefined;

interface WMPointer {
  address: string;
  chance: number;
}

interface fundOptions {
  maxPool?: number;
  setDefault?: boolean;
}

// declare var document: any;
// declare var window: any;