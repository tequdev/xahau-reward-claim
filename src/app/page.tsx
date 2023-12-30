'use client'
import useXumm from '@tequ/use-xumm-hook'
import { Button, CircularProgress } from '@nextui-org/react'
import { ClaimReward } from './ClaimReward'
import { Suspense } from 'react'
import config from '@/config'

export default function Home() {
  const { status, connect, disconnect, user, signTransaction } = useXumm(
    process.env.NEXT_PUBLIC_XUMM_APIKEY!, process.env.XUMM_SECRET!
  )

  const handleClaimReward = async () => {
    try {
      await signTransaction(
        {
          txjson: {
            TransactionType: 'ClaimReward',
            Issuer: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh' // Genesis Account
          },
          options: {
            force_network: config['xaman-network'],
          }
        })
    } catch (e) {
      alert("An error was detected. Please try again later.")
    }
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
          <Suspense fallback={<CircularProgress aria-label="Loading..." />}>
            <ClaimReward account={user.account} txBtn={
            (label: string) => <Button color="primary" size='lg' onClick={handleClaimReward}>{label}</Button>
            } />
          </Suspense>
        </>
      }
    </main>
  )
}
