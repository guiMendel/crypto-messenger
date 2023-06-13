import { Conversation } from '@xmtp/xmtp-js'
import { createContext } from 'react'

interface ChatInterface {
  chats: Conversation[]
  openChat: (address: string) => void
  closeChat: () => void
  getCurrentChatAddress: () => null | string
}

export const ChatContext = createContext<ChatInterface>({
  chats: [],
  getCurrentChatAddress: () => null,
  openChat: (address) => {},
  closeChat: () => {},
})
