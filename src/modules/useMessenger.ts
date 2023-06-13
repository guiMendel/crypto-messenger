import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Client, Conversation } from '@xmtp/xmtp-js'
import { useEffect, useState } from 'react'

// Useful to avoid  restarting the messenger for the same address
let lastAddress = ''

// List of cleanup callbacks attached to a new messenger update
const messengerCleanups: (() => void)[] = []

export const useMessenger = () => {
  // ===================================
  // === MESSENGER CLIENT
  // ===================================

  // Get wallet from dynamic
  const { primaryWallet } = useDynamicContext()

  // The messenger interface
  const [messenger, setMessenger] = useState<null | Client>(null)

  // Updates the messenger and calls dependent functions
  const updateMessenger = (newMessenger: Client) => {
    console.log('got new messenger')

    // Set the messenger itself
    setMessenger(newMessenger)

    // Update chats
    messengerCleanups.push(updateChats(newMessenger))
  }

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

    console.log('getting messenger')

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
      .then(updateMessenger)
      .catch((error) => {
        console.log('failed to get messenger', error)
      })

    // Execute cleanups
    return () => {
      for (const cleanup of messengerCleanups) cleanup()
    }
  }, [primaryWallet])

  // ===================================
  // === CHATS
  // ===================================

  // Chats of the current user
  const [chats, setChats] = useState<Conversation[]>([])

  const updateChats = (messenger: Client) => {
    if (messenger == undefined) {
      setChats([])
      return () => {}
    }

    // Initializes chats
    messenger.conversations
      .list()
      .then((newChats) => {
        setChats((chats) => [...chats, ...newChats])
      })
      .catch((error) => {
        console.log('failed to initialize chats', error)
      })

    // Stops streaming
    let stopStreaming = (_: { value: null; done: true }) => {}

    // Resolves when this effect is cleaned up
    const cleanupPromise = new Promise<{ value: null; done: true }>(
      (resolve) => (stopStreaming = resolve)
    )

    // Stream new conversations for this user
    messenger.conversations
      .stream()
      .then(async (conversations) => {
        while (true) {
          // Get new conversation
          const { value, done } = await Promise.race([
            conversations.next(),
            cleanupPromise,
          ])

          // Stop if done
          if (done) return

          // Add the new conversation to the chats
          setChats((chats) => [...chats, value])
        }
      })
      .catch((error) => {
        console.log('failed to stream chats', error)
      })

    return () => stopStreaming({ value: null, done: true })
  }

  return { chats }
}
