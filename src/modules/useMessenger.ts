import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Client } from '@xmtp/xmtp-js'
import { useEffect, useState } from 'react'

// Useful to avoid  restarting the messenger for the same address
let lastAddress = ''

export const useMessenger = () => {
  // Get wallet from dynamic
  const { primaryWallet } = useDynamicContext()

  // The messenger interface
  const [messenger, setMessenger] = useState<null | Client>(null)

  // Synchronize the messenger to the signed user
  useEffect(() => {
    // If no wallet, no messenger
    if (primaryWallet == null) {
      setMessenger(null)
      lastAddress = ''
      return
    }

    // If wallet hasn't changed, ignore
    if (primaryWallet.address == lastAddress) return
    lastAddress = primaryWallet.address

    // Get the wallet's signer
    primaryWallet.connector
      .getSigner()
      .then((signer) =>
        Client.create({
          ...(signer as JsonRpcSigner),
          getAddress: (signer as JsonRpcSigner).getAddress,
          signMessage: (message) => {
            console.log('spying message:', message)
            return (signer as JsonRpcSigner).signMessage(message)
          },
        })
      )
      .then(setMessenger)
  }, [primaryWallet])

  return messenger
}
