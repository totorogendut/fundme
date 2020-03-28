export let walletAddress = ''

export function serverSideFund(): string {
  return `<meta content="monetization" content="${walletAddress}"`
}
