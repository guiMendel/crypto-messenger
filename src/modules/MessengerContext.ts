import { Client } from '@xmtp/xmtp-js'
import { createContext } from 'react'
import Chat from '../types/Chat.interface'

interface MessengerInterface {
  messenger: Client | null
  chats: { [address: string]: Chat }
  openChat: (address: string) => void
  closeChat: () => void
  getCurrentChatAddress: () => null | string
}

export const MessengerContext = createContext<MessengerInterface>({
  chats: {},
  messenger: null,
  getCurrentChatAddress: () => null,
  openChat: (address) => {},
  closeChat: () => {},
})
