type WMAddress = string | Array<string | WMPointer> | undefined

interface WMPointer {
  address: string
  weight: number
}

interface fundOptions {
  force?: 'client' | 'server'
  maxPool?: number
  default?: boolean
  affiliateId?: string
  affiliateEntry?: boolean
}

// declare var document: any;
// declare var window: any;
