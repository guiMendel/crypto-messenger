import { Conversation } from '@xmtp/xmtp-js'
import { useEffect, useState } from 'react'
import Profile from '../../components/Profile'
import { useMessenger } from '../../modules/useMessenger'
import { ReactComponent as EmptyPicture } from './empty.svg'
import './style.scss'
import ChatPreview from '../../components/ChatPreview'

export default function Chats() {
  const { chats } = useMessenger()

  useEffect(() => {
    console.log(chats)
  }, [chats])

  return (
    <div id="chats">
      {/* Profile & Chat Select */}
      <main>
        {/* Profile */}
        <Profile />

        {chats.length == 0 ? (
          // No chat messages warning
          <div className="no-chats">
            <p>Looks like you haven't started any chats yet.</p>

            <EmptyPicture />
          </div>
        ) : (
          // Chat messages
          <div className="chats">
            {/* Chats */}
            {chats.map((chat) => (
              <ChatPreview chat={chat} key={chat.topic} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
