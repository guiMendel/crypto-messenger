import { Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import { useContext, useEffect, useState } from 'react'
import { MessengerContext } from './MessengerContext'
import conversationToChat from './conversationToChat'

// How many messages to fetch initially
const initialMessageCount = 20

// Syncs a single chat
export default function useChat(address: string | undefined) {
  const { messenger } = useContext(MessengerContext)

  // Get this chat
  const [conversation, setConversation] = useState<Conversation | null>(null)

  // Store messages
  const [messages, setMessages] = useState<DecodedMessage[]>([])

  // Sync conversation to messenger
  useEffect(() => {
    // Treat empty chats
    if (address == null || messenger == null) {
      setConversation(null)
      return
    }

    messenger.conversations
      // Fetch new conversation
      .newConversation(address)
      // Set it locally
      .then(setConversation)
      // Reset if error found
      .catch(() => setConversation(null))
  }, [messenger])

  // Sync conversation messages
  useEffect(() => {
    if (conversation == null) return

    // Stops streaming
    let stopStreaming = () => {}

    // Resolves when this effect is cleaned up
    const cleanupPromise = new Promise<{ value: null; done: true }>(
      (resolve) => (stopStreaming = () => resolve({ value: null, done: true }))
    )

    conversation
      // Fetch first few messages
      .messages({ limit: initialMessageCount })
      .then((newMessages) => {
        // Add them
        setMessages((messages) => [...messages, ...newMessages])

        // Start streaming new messages
        return conversation.streamMessages()
      })
      .then(async (messageStream) => {
        while (true) {
          // Get new message
          const { value, done } = await Promise.race([
            messageStream.next(),
            cleanupPromise,
          ])

          // Stop if done
          if (done) return

          // Add the new message
          setMessages((messages) => [...messages, value])
        }
      })
      .catch((error) => console.log('failed to stream messages', error))

    return stopStreaming
  }, [conversation])

  return conversation == null
    ? null
    : conversationToChat(conversation, messages)
}
