const configs = {
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

const config = configs[process.env.NEXT_PUBLIC_NETWORK as keyof typeof configs || 'xahau-testnet']

export default config
