export let walletAddress = ''

export const isServer = (): boolean => {
  return true
}

export function serverSideFund(pointers: WMAddress): string {
  return `<meta content="monetization" content="${walletAddress}"`
}
