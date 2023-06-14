import { Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import Chat from '../types/Chat.interface'

// Turns conversation to chat
export default function conversationToChat(
  conversation: Conversation,
  messages?: DecodedMessage[]
): Chat {
  return {
    messages: messages?.sort(({ sent }) => sent.getTime()) ?? [],
    peerAddress: conversation.peerAddress,
    latestMessage:
      messages != undefined && messages.length > 0
        ? messages[0].content
        : undefined,
  }
}

export async function conversationToChatInitialize(
  conversation: Conversation,
  messages?: DecodedMessage[]
): Promise<Chat> {
  // Get one message for it
  const newMessages = await conversation.messages({ limit: 1 })

  console.log('initialized with', newMessages)

  // Include this message
  if (messages === undefined) messages = newMessages
  else if (newMessages.length > 0 && messages.includes(newMessages[0]) == false)
    messages = [...messages, newMessages[0]]

  // Get the chat
  return conversationToChat(conversation, messages)
}

export async function conversationsToChats(
  conversations: Conversation[]
): Promise<{ [address: string]: Chat }> {
  const chats: { [address: string]: Chat } = {}

  // Turn each conversation into a chat, and initialize them
  for (const conversation of conversations)
    chats[conversation.peerAddress] = await conversationToChatInitialize(
      conversation
    )

  return chats
}
