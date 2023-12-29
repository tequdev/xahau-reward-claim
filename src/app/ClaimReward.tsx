import { fetchAccountRoot, fetchCurrentLedger, fetchRewardDelay, fetchRewardRate } from "@/lib/xahau";
import { ReactNode, use } from "react";

type Props = {
  account: string
  txBtn: ReactNode
}

const rewardRateHuman = (rewardRate: number) => {
  if (!rewardRate) return "0 %"
  if (rewardRate < 0 || rewardRate > 1) return "Invalid rate"
  return (Math.round((((1 + rewardRate) ** 12) - 1) * 10000) / 100) + " %"
}

const rewardDelayHuman = (rewardDelay: number) => {
  if (rewardDelay / 3600 < 1) return Math.ceil(rewardDelay / 60) + " mins"
  if (rewardDelay / (3600 * 24) < 1) return Math.ceil(rewardDelay / 3600) + " hours"
  return Math.ceil(rewardDelay / (3600 * 24)) + ' days'
}

export const ClaimReward = async ({ account, txBtn }: Props) => {
  const accountRoot = await fetchAccountRoot(account) as any
  const ledger = await fetchCurrentLedger()
  const rewardRate = await fetchRewardRate()
  const rewardDelay = await fetchRewardDelay()

  const RewardLgrFirst = accountRoot?.RewardLgrFirst || 0
  const RewardLgrLast = accountRoot?.RewardLgrLast || 0
  const RewardTime = accountRoot?.RewardTime || 0
  const RewardAccumulator = accountRoot?.RewardAccumulator ? parseFloat(BigInt('0x' + accountRoot?.RewardAccumulator).toString()) : 0

  const remaining_sec = rewardDelay - (ledger.close_time - RewardTime)

  const claimable = remaining_sec <= 0

  const now = new Date()
  const claimableDate = new Date(now.getTime() + remaining_sec * 1000)

  // calculate reward
  const cur = ledger.ledger_index as unknown as number
  const elapsed = cur - RewardLgrFirst
  const elapsed_since_last = cur - RewardLgrLast
  let accumulator = RewardAccumulator
  if (parseFloat(accountRoot.Balance) > 0 && elapsed_since_last > 0) {
    accumulator += parseFloat(accountRoot.Balance) / 1000000 * elapsed_since_last
  }
  const reward = accumulator / elapsed * rewardRate

  return (
    <div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Reward Rate</div>
          <div className="stat-value">{rewardRateHuman(rewardRate)}</div>
          <div className="stat-desc text-right">APY</div>
        </div>

        <div className="stat">
          <div className="stat-title">Reward Delay</div>
          <div className="stat-value">{rewardDelayHuman(rewardDelay)}</div>
          <div className="stat-desc text-right">after last claim</div>
        </div>
      </div>

      <div className="mt-4">

        {claimable &&
          <div>
            <div className="text-center">{txBtn}</div>
            <div className="text-center mt-4">
              Estimated Rewards:<br /><span className="text-xl">{reward.toFixed(4)}XAH</span>
            </div>
          </div>
        }
        {!claimable &&
          <div>
            <div className="text-center">
              Claimable in <br /><span className="text-xl">{claimableDate.toLocaleString()}</span>
            </div>
          </div>
        }
      </div>
    </div>
  )
}