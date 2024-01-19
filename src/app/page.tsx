'use client'
import useXumm from '@tequ/use-xumm-hook'
import { Button, CircularProgress } from '@nextui-org/react'
import { ClaimReward } from './ClaimReward'
import { defaultConfig, configs } from '@/config'
import { Client } from '@transia/xrpl'
import { useEffect, useState } from 'react'

export default function Home() {
  const { status, connect, disconnect, user, signTransaction, xumm } = useXumm(
    process.env.NEXT_PUBLIC_XUMM_APIKEY!, process.env.XUMM_SECRET!
  )
  const [config, setConfig] = useState(defaultConfig)
  const [client,setClient] = useState(new Client(config['wss']))

  if (xumm.runtime.xapp) {
    (xumm.environment.ott)?.then(data => {
      const nodetype = data?.nodetype
      if(nodetype?.toLowerCase().includes('test') && config['xaman-network'] !=='xahau-testnet') {
        setConfig(configs['xahau-testnet'])
        setClient(new Client(configs['xahau-testnet']['wss']))
      }
    })
  }

  useEffect(() => {
    const handler = (data: { network?: string }) => {
      if (data.network?.toLowerCase().includes('test')) {
        setConfig(configs['xahau-testnet'])
        setClient(new Client(configs['xahau-testnet']['wss']))
      } else {
        setConfig(defaultConfig)
        setClient(new Client(defaultConfig['wss']))
      }
    }
    xumm.xapp?.on('networkswitch', handler)
    return () => {
      xumm.xapp?.off('networkswitch', handler)
    }
  },[xumm.xapp])

  const handleClaimReward = async () => {
    try {
      const payload = await signTransaction(
        {
          txjson: {
            TransactionType: 'ClaimReward',
            Issuer: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', // Genesis Account
            NetworkID: config['networkId'],
          },
          options: {
            expire: 15,
            force_network: config['xaman-network'],
          }
        })
      if (!payload?.response.txid) return null
      const txid = payload.response.txid
      if (!txid) return null
      const nodeuri = payload.response.environment_nodeuri!
      const client = new Client(nodeuri)
      await client.connect()
      let validated = false
      do {
        const response = await client.request({
          command: 'tx',
          transaction: txid,
        })
        validated = response.result.validated || false
        await new Promise(resolve => setTimeout(resolve, 1000))
      } while (!validated)
      await client.disconnect()
      return txid
    } catch (e) {
      alert("An error was detected. Please try again later.")
    }
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-12 sm:p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Xahau <br className='sm:hidden' /> Reward Claim</h1>

      {status === 'unconnected' &&
        <Button color="primary" onClick={connect}>Connect</Button>
      }
      {status === 'loading' &&
        <CircularProgress aria-label="Loading..." />
      }
      {status === 'connected' && user?.account &&
        <>
          <div className='flex items-center my-4 space-x-1'>
            <div className="text-lg">{user.account.substring(0, 15)}...</div>
            <Button className='' color="success" onClick={disconnect}>Disconnect</Button>
          </div>
          <ClaimReward client={client} account={user.account} onTransaction={handleClaimReward} />
        </>
      }
    </main>
  )
}
