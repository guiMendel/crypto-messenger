import { useEffect, useRef, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { JSX } from 'react/jsx-runtime'
import ChatPreview from '../../components/ChatPreview'
import Profile from '../../components/Profile'
import { useMessenger } from '../../modules/useMessenger'
import { ReactComponent as EmptyPicture } from './empty.svg'
import './style.scss'

// Chat control options
enum ChatOption {
  Search,
  New,
}

// Links options to icons
const ControlsLinkTable: { [key in ChatOption]: JSX.Element } = {
  [ChatOption.Search]: <FaSearch />,
  [ChatOption.New]: <FaPlus />,
}

export default function Chats() {
  // Consume chats for current user
  const { chats } = useMessenger()

  // Which chat control option is selected
  const [currentOption, setCurrentOption] = useState<null | ChatOption>(null)

  // Focus on an input of the given control
  const focusOn = (control: string) =>
    (
      document.querySelector(`.${control} input`) as HTMLInputElement | null
    )?.focus()

  // Sets the option from a string
  const setOption = (value: string) => {
    const parsedValue = parseInt(value)

    if (currentOption == parsedValue) {
      setCurrentOption(null)
      return
    }

    setCurrentOption(parsedValue)

    if (parsedValue == ChatOption.New) focusOn('new-chat')
    else if (parsedValue == ChatOption.Search) focusOn('search-chats')
  }

  // Returns 'active' if the option is the provided one
  const getClassForOption = (option: ChatOption) =>
    currentOption != null && currentOption == option ? 'active' : ''

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
        <div className="control-panel">
          {/* Options */}
          <div className="options">
            {Object.entries(ControlsLinkTable).map(([option, icon]) => (
              <div
                key={option}
                className={`option ${
                  parseInt(option) == currentOption ? 'selected' : ''
                }`}
                onClick={() => setOption(option)}
              >
                {icon}
              </div>
            ))}
          </div>

          <div className={`controls ${currentOption != null ? 'active' : ''}`}>
            {/* Searchbar */}
            <div
              className={`control search-chats ${getClassForOption(
                ChatOption.Search
              )}`}
            >
              <input type="text" placeholder="Who to looking for?" />
            </div>

            {/* New chat */}
            <div
              className={`control new-chat ${getClassForOption(
                ChatOption.New
              )}`}
            >
              <input type="text" placeholder="Type an address" />
            </div>
          </div>
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
