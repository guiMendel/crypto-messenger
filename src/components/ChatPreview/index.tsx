import { Conversation } from '@xmtp/xmtp-js'
import { useState } from 'react'
import './style.scss'

export default function ChatPreview({ chat }: { chat: Conversation }) {
  // Stores the latest message
  const [message, setMessage] = useState('')

  return (
    <div className="chat-preview">
      {/* Peer's picture */}O{/* Conversation details */}
      <div className="text">
        {/* Name */}
        <p>{chat.peerAddress}</p>

        {/* Latest message */}
        <small>{message}</small>
      </div>
    </div>
  )
}
