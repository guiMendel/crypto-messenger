import { useEffect } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import ChatPreview from '../../components/ChatPreview'
import Profile from '../../components/Profile'
import { useMessenger } from '../../modules/useMessenger'
import { ReactComponent as EmptyPicture } from './empty.svg'
import './style.scss'

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

        {/* Main controls */}
        <div className="controls">
          {/* Options */}
          <div className="options">
            {/* Search chats */}
            <div className="option">
              <FaSearch />
            </div>

            {/* New chat */}
            <div className="option">
              <FaPlus />
            </div>
          </div>

          {/* Searchbar */}
          <input
            className="search-chats"
            type="text"
            placeholder="Who to looking for?"
          />
        </div>

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
