import { useContext, useEffect } from 'react'
import { MessengerContext } from '../../modules/MessengerContext'
import ChatPreview from '../ChatPreview'
import { ReactComponent as EmptyPicture } from './empty.svg'
import './style.scss'

export default function SearchChats() {
  // Consume chats for current user
  const { chats } = useContext(MessengerContext)

  if (Object.keys(chats).length == 0)
    return (
      <div className="no-chats">
        <p>Couldn't find any chats.</p>

        <EmptyPicture />
      </div>
    )

  return (
    <div className="chats">
      {/* Chats */}
      {Object.values(chats).map((chat) => (
        <ChatPreview chat={chat} key={chat.peerAddress} />
      ))}
    </div>
  )
}
