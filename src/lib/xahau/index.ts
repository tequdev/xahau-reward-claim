import { Client } from "@transia/xrpl"
import { hookStateXLFtoBigNumber } from "./xfl"
import config from "@/config"

const client = new Client(config.wss)

export const fetchAccountRoot = async (address: string) => {
  await client.connect()
  const response = await client.request({
    command: 'account_info',
    account: address,
    ledger_index: 'validated',
  })
  return response.result.account_data
}

export const fetchCurrentLedger = async () => {
  await client.connect()
  const response = await client.request({
    command: 'ledger',
    ledger_index: 'validated',
  })
  return response.result.ledger
}

export const fetchRewardRate = async () => {
  await client.connect()
  const response = await client.request({
    command: 'ledger_entry',
    hook_state: {
      account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
      key: '0000000000000000000000000000000000000000000000000000000000005252', // RR
      namespace_id: '0000000000000000000000000000000000000000000000000000000000000000'
    }
  })
  // @ts-ignore
  return hookStateXLFtoBigNumber(response.result.node['HookStateData'])
}

export const fetchRewardDelay = async () => {
  await client.connect()
  const response = await client.request({
    command: 'ledger_entry',
    hook_state: {
      account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
      key: '0000000000000000000000000000000000000000000000000000000000005244', // RD
      namespace_id: '0000000000000000000000000000000000000000000000000000000000000000'
    }
  })
  // @ts-ignore
  return hookStateXLFtoBigNumber(response.result.node['HookStateData'])
}
