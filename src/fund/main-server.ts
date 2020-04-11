export let walletAddress = ''

export function serverSideFund(pointers: WMAddress): string {
  return `<meta content="monetization" content="${walletAddress}"`
}
