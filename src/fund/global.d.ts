type WMAddress = string | Array<string | WMPointer> | undefined
type returnValidPointer = string | HTMLMetaElement
type defaultAddress = string | WMPointer | (string | WMPointer)[]

interface WMPointer {
  address: string
  weight?: number
}

interface fundOptions {
  force?: 'client' | 'server'
  maxPool?: number
  default?: boolean
  affiliateId?: string
  affiliateEntry?: boolean
}

interface defaultAddressOptions {
  allowUndefined?: boolean
}

// declare var document: any;
// declare var window: any;
