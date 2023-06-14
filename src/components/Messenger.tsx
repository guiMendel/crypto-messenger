import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Client, DecodedMessage } from '@xmtp/xmtp-js'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessengerContext } from '../modules/MessengerContext'
import { SignaturePendingContext } from '../modules/SignaturePendingContext'
import conversationToChat, {
  conversationsToChats,
} from '../modules/conversationToChat'
import Chat from '../types/Chat.interface'

// Useful to avoid  restarting the messenger for the same address
let lastAddress = ''

// // List of cleanup callbacks attached to a new messenger update
// const messengerCleanups: (() => void)[] = []

// // Allows listening to messenger updates & returning cleanup functions
// export type messengerListener = (messenger: Client | null) => () => void

// export type messengerEvent = {
//   addListener: (id: string, listener: messengerListener) => void
//   removeListener: (id: string) => void
// }

export default function Messenger({ children }: { children: React.ReactNode }) {
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

  // const [messengerListeners, setMessengerListeners] = useState<{
  //   [key: string]: messengerListener
  // }>({})

  // const OnUpdateMessenger: messengerEvent = {
  //   addListener: (id: string, listener: messengerListener) =>
  //     setMessengerListeners((listeners) => ({ ...listeners, [id]: listener })),

  //   removeListener: (id: string) =>
  //     setMessengerListeners((listeners) => {
  //       delete listeners[id]

  //       return listeners
  //     }),
  // }

  // // Updates the messenger and calls dependent functions
  // const updateMessenger = (newMessenger: Client) => {
  //   console.log('got new messenger')

  //   // Set the messenger itself
  //   setMessenger(newMessenger)

  //   // // Update listeners
  //   // for (const listener of Object.values(messengerListeners))
  //   //   messengerCleanups.push(listener(messenger))
  // }

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

    // Signature pending text
    const pendingMessage = 'We are connecting you to our messenger client'

    // Get the wallet's signer
    primaryWallet.connector
      .getSigner()
      .then((signer) => {
        // Set signature pending
        setPendingText(pendingMessage)

        return Client.create(signer as JsonRpcSigner)
      })
      .then((newMessenger) => {
        setMessenger(newMessenger)

        // Conclude signature
        setPendingText((text: string) => (text === pendingMessage ? '' : text))
      })
      .catch((error) => {
        console.log('failed to get messenger', error)
        logout()

        // Cancel signature
        setPendingText('')
      })
  }, [primaryWallet])

  // ===================================
  // === CHATS SYNCHRONIZATION
  // ===================================

  // Chats of the current user
  const [chats, setChats] = useState<{ [address: string]: Chat }>({})

  useEffect(() => {
    if (messenger == undefined) {
      setChats({})
      return
    }

    // Initializes chats
    messenger.conversations
      .list()
      .then(async (newConversations) => {
        // Turn them into chats
        const newChats = await conversationsToChats(newConversations)

        setChats((chats) => ({ ...chats, ...newChats }))
      })
      .catch((error) => {
        console.log('failed to initialize chats', error)
      })

    // Stops streaming
    let stopStreaming = () => {}

    // Resolves when this effect is cleaned up
    const cleanupPromise = new Promise<{ value: null; done: true }>(
      (resolve) => (stopStreaming = () => resolve({ value: null, done: true }))
    )

    // Stream new conversations for this user
    messenger.conversations
      .streamAllMessages()
      .then(async (messageStream) => {
        while (true) {
          // Get new conversation
          const { value, done } = await Promise.race([
            messageStream.next(),
            cleanupPromise,
          ])

          // Get as message
          const message = value as DecodedMessage

          // Stop if done
          if (done) return

          // Add the new conversation to the chats
          setChats((chats) => ({
            ...chats,
            [message.senderAddress]: {
              messages: [message],
              peerAddress: message.senderAddress,
              latestMessage: message.content,
            },
          }))
        }
      })
      .catch((error) => {
        console.log('failed to stream chats', error)
      })

    return stopStreaming
  }, [messenger])

  // =====================================
  // === CURRENT CHAT HANDLING
  // =====================================

  // Grab currently open chat address
  const [searchParams, setSearchParams] = useSearchParams()

  // Get current chat
  const [selectedChat, setSelectedChat] = useState<null | string>(null)

  // Open a chat
  const openChat = (address: string) => setSearchParams({ chat: address })

  // Close a chat
  const closeChat = () => setSearchParams({})

  // Sync selected chat to url param
  useEffect(() => setSelectedChat(searchParams.get('chat')), [searchParams])

  return (
    <MessengerContext.Provider
      value={{ messenger, chats, openChat, closeChat, selectedChat }}
    >
      {children}
    </MessengerContext.Provider>
  )
}
