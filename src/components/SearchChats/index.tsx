import { useContext, useEffect } from 'react'
import { ChatContext } from '../../modules/ChatContext'
import ChatPreview from '../ChatPreview'
import { ReactComponent as EmptyPicture } from './empty.svg'
import './style.scss'

export default function SearchChats() {
  // Consume chats for current user
  const { chats } = useContext(ChatContext)

  useEffect(() => {
    console.log(chats)
  }, [chats])

  if (chats.length == 0)
    return (
      <div className="no-chats">
        <p>Couldn't find any chats.</p>

        <EmptyPicture />
      </div>
    )

  return (
    <div className="chats">
      {/* Chats */}
      {chats.map((chat) => (
        <ChatPreview chat={chat} key={chat.topic} />
      ))}
    </div>
  )
}
