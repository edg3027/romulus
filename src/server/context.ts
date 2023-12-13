import { DefaultAccount } from './db/account/outputs'
import { getSessionWithAccount } from './session'

export type Context = {
  account: DefaultAccount | null
}

export async function createContext(): Promise<Context> {
  const { account } = await getSessionWithAccount()

  return { account }
}
