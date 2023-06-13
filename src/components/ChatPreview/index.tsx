import { Conversation } from '@xmtp/xmtp-js'
import { useState } from 'react'
import './style.scss'
import ProfilePicture from '../ProfilePicture'

export default function ChatPreview({ chat }: { chat: Conversation }) {
  // Stores the latest message
  const [message, setMessage] = useState('Hey buddy')

  return (
    <div className="chat-preview">
      {/* Peer's picture */}
      <div className="picture">
        <ProfilePicture address={chat.peerAddress} size={40} />
      </div>

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
