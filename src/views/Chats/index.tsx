import { createContext, useRef, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { JSX } from 'react/jsx-runtime'
import Profile from '../../components/Profile'
import './style.scss'
import { Outlet, useNavigate } from 'react-router-dom'
import { ControlInputContext } from '../../modules/ControlInputContext'

// Chat control options
enum ChatOption {
  Search,
  New,
}

// Links options to icons
const controlsData: {
  [key in ChatOption]: {
    icon: JSX.Element
    route: string
    name: string
    inputPlaceholder: string
  }
} = {
  [ChatOption.Search]: {
    icon: <FaSearch />,
    name: 'search-chats',
    route: '/',
    inputPlaceholder: 'Who to search for',
  },
  [ChatOption.New]: {
    icon: <FaPlus />,
    name: 'new-chat',
    route: '/new',
    inputPlaceholder: 'Type an address',
  },
}

export default function Chats() {
  // Which chat control option is selected
  const [currentOption, setCurrentOption] = useState<null | ChatOption>(null)

  // Get data for current option
  const getOptionData = (option?: number) =>
    controlsData[(option as unknown as ChatOption) ?? currentOption]

  // Navigate route
  const navigate = useNavigate()

  // Sets the option from a string
  const setOption = (value: string) => {
    const parsedValue = parseInt(value)

    if (currentOption == parsedValue) {
      setCurrentOption(null)
      navigate('/')
      return
    }

    // Set the option
    setCurrentOption(parsedValue)

    // Focus the input
    inputRef.current?.focus()

    // Navigate to the option's route
    navigate(getOptionData(parsedValue).route)
  }

  // =====================================
  // === INPUT HANDLING
  // =====================================

  // State of the input
  const [inputValue, setInputValue] = useState('')

  // Ref to field
  const inputRef = useRef<HTMLInputElement>(null)

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
            {Object.entries(controlsData).map(([option, { icon }]) => (
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
            {/* Input text */}
            <input
              ref={inputRef}
              type="text"
              placeholder={getOptionData()?.inputPlaceholder}
              value={inputValue}
              onChange={({ target }) => setInputValue(target.value)}
            />
          </div>
        </div>

        <ControlInputContext.Provider
          value={{ input: inputValue, setInput: setInputValue }}
        >
          <Outlet />
        </ControlInputContext.Provider>
      </main>
    </div>
  )
}
