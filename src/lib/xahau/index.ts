import { Client } from "@transia/xrpl"
import { hookStateXLFtoBigNumber } from "./xfl"

export const fetchAccountRoot = async (client:Client, address: string) => {
  await client.connect()
  const response = await client.request({
    command: 'account_info',
    account: address,
    ledger_index: 'validated',
  })
  return response.result.account_data
}

export const fetchCurrentLedger = async (client: Client,) => {
  await client.connect()
  const response = await client.request({
    command: 'ledger',
    ledger_index: 'validated',
  })
  return response.result.ledger
}

export const fetchRewardRate = async (client: Client,) => {
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

export const fetchRewardDelay = async (client: Client,) => {
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
