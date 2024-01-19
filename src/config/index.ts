export const configs = {
  'xahau-mainnet': {
    'xaman-network': 'xahau',
    wss: 'wss://xahau.org',
    networkId: 21337
  },
  'xahau-testnet': {
    'xaman-network': 'xahau-testnet',
    wss: 'wss://xahau-test.net',
    networkId: 21338
  }
}

export const defaultConfig = configs[process.env.NEXT_PUBLIC_NETWORK as keyof typeof configs || 'xahau-testnet']

defaultConfig
