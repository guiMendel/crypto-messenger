import { useContext, useState } from 'react'
import { MessengerContext } from '../../modules/MessengerContext'
import Chat from '../../types/Chat.interface'
import ProfilePicture from '../ProfilePicture'
import './style.scss'

export default function ChatPreview({ chat }: { chat: Chat }) {
  // Stores the latest message
  const [message, setMessage] = useState('Hey buddy')

  // Consume chats for current user
  const { openChat, closeChat, getCurrentChatAddress } =
    useContext(MessengerContext)

  // Handle clicking a chat
  const handleSelect = () => {
    if (chat.peerAddress === getCurrentChatAddress()) closeChat()
    else openChat(chat.peerAddress)
  }

  return (
    <div className="chat-preview" onClick={handleSelect}>
      {/* Peer's picture */}
      <ProfilePicture address={chat.peerAddress} size={40} />

      {/* Conversation details */}
      <div className="text">
        {/* Name */}
        <p>{chat.peerAddress}</p>

        {/* Latest message */}
        <small>{message}</small>
      </div>
    </div>
  )
}
