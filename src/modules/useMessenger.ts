import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Client, Conversation,  } from '@xmtp/xmtp-js'
import { useContext, useEffect, useState } from 'react'
import { SignaturePendingContext } from './SignaturePendingContext'

// Useful to avoid  restarting the messenger for the same address
let lastAddress = ''

// List of cleanup callbacks attached to a new messenger update
const messengerCleanups: (() => void)[] = []

export const useMessenger = () => {
  // Consume signature pending
  const { setPendingText } = useContext(SignaturePendingContext)

  // ===================================
  // === MESSENGER CLIENT
  // ===================================

  // Get wallet from dynamic
  const { primaryWallet, handleLogOut } = useDynamicContext()

  // Unlinks wallet
  const logout = () => (primaryWallet == undefined ? null : handleLogOut())

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
      console.log('no wallet found')

      setMessenger(null)
      lastAddress = ''
      return
    }

    // If wallet hasn't changed, ignore
    if (primaryWallet.address == lastAddress) return
    lastAddress = primaryWallet.address

    console.log('getting messenger')

    // Signature pending text
    const pendingMessage = 'We are connecting you to our messenger client'

    // Get the wallet's signer
    primaryWallet.connector
      .getSigner()
      .then((signer) => {
        // Set signature pending
        setPendingText(pendingMessage)

        // return Client.create(wallet)
        return Client.create({
          ...(signer as JsonRpcSigner),
          getAddress: (signer as JsonRpcSigner).getAddress,
          signMessage: (message) => {
            console.log('spying message:', message)
            return (signer as JsonRpcSigner).signMessage(message)
          },
        })
      })
      .then((newMessenger) => {
        updateMessenger(newMessenger)

        // Conclude signature
        setPendingText((text: string) => (text === pendingMessage ? '' : text))
      })
      .catch((error) => {
        console.log('failed to get messenger', error)
        logout()

        // Cancel signature
        setPendingText('')
      })

    // Execute cleanups
    return () => {
      for (const cleanup of messengerCleanups) cleanup()
    }
  }, [primaryWallet])

  // ===================================
  // === CHATS SYNCHRONIZATION
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

  // ===================================
  // === NEW CHAT
  // ===================================

  const createChat = (address: string) => {
    if (messenger == null) return

    return messenger.conversations.newConversation(address)
  }

  return { chats, logout, createChat }
}
