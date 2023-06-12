import { Client } from '@xmtp/xmtp-js'
import { Wallet } from 'ethers'
import { useEffect, useState } from 'react'

export const useMessenger = () => {
  // TODO: replace
  const wallet = Wallet.createRandom()

  // The messenger interface
  const [messenger, setMessenger] = useState<null | Client>(null)

  // Initialize the messenger
  useEffect(() => {
    Client.create(wallet).then(setMessenger)
  }, [])

  return messenger
}
