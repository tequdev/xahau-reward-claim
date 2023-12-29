const configs = {
  'xahau-mainnet': {
    'xaman-network': 'xahau',
    wss: 'wss://xahau.org'
  },
  'xahau-testnet': {
    'xaman-network': 'xahau-testnet',
    wss: 'wss://xahau-test.net'
  }
}

const config = configs[process.env.NEXT_PUBLIC_NETWORK as keyof typeof configs || 'xahau-testnet']

export default config
