import { DecodedMessage } from '@xmtp/xmtp-js'
import { useContext, useEffect, useRef, useState } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { MessengerContext } from '../../modules/MessengerContext'
import useChat from '../../modules/useChat'
import ProfilePicture from '../ProfilePicture'
import './style.scss'

type displayMessages = (Omit<DecodedMessage, 'toBytes'> & {
  type: 'incoming' | 'outgoing'
})[]

// Hold last messages for animation sake
let lastMessages: displayMessages = []

export default function Chat({ address }: { address: string | null }) {
  // ==========================================
  // === NEW MESSAGE
  // ==========================================

  // Input field ref
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Automatically adjusts height of input field to match content
  function adjustFieldHeight() {
    if (inputRef.current == null) return

    inputRef.current.style.height = '1px'
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
  }

  // Message content
  const [message, setMessage] = useState('')

  // Send the message
  const sendMessage = () => {
    let sent = false

    setMessage((currentMessage) => {
      if (sent) return ''
      sent = true

      if (currentMessage.trim() != '')
        chat
          ?.send(currentMessage.trim())
          .then(({ content }) => console.log('SENT', content))

      return ''
    })
  }

  // ==========================================
  // === CHAT SYNC
  // ==========================================

  // Syncs the chat to the current address
  const chat = useChat(address)

  // Converts a message into either 'incoming' or 'outgoing'
  const getSenderType = (message: DecodedMessage): 'incoming' | 'outgoing' =>
    message.senderAddress === address ? 'incoming' : 'outgoing'

  // Store sorted messages
  const messages: displayMessages = (lastMessages =
    address == null || chat == null
      ? lastMessages
      : Object.values(chat.messages)
          .sort(({ sent: sentA }, { sent: sentB }) => {
            if (sentA > sentB) return 1
            if (sentA === sentB) return 0
            return -1
          })
          .map((message) => ({ ...message, type: getSenderType(message) })))

  console.log(messages.map(({ sent }) => sent.getTime()))

  // useEffect(
  //   () => console.log('new chat:', chat),
  //   // () => console.log('new chat:', messages[messages.length - 1]),
  //   [chat]
  // )

  // ==========================================
  // === INBOX
  // ==========================================

  // Ref of message scroller
  const messageScrollerRef = useRef<HTMLDivElement>(null)

  // Scroll to end of messages
  useEffect(() => {
    if (messageScrollerRef.current == null || chat == null) return

    // Set scroll to end
    messageScrollerRef.current.scrollTop =
      messageScrollerRef.current.scrollHeight
  }, [messageScrollerRef, chat])

  // Gets readable date from message
  const getTimestamp = ({ sent }: { sent: Date }) => {
    const pad = (number: number) => String(number).padStart(2, '0')

    // Get time difference
    const dateDifference = new Date().getTime() - sent.getTime()

    // If it's less than a day old
    if (dateDifference <= 8.64e7)
      return `${pad(sent.getHours())}:${pad(sent.getMinutes())}`

    // Display as date
    return `${pad(sent.getMonth())}/${pad(sent.getDay())}, ${pad(
      sent.getHours()
    )}:${pad(sent.getMinutes())}`
  }

  // ==========================================
  // === HOTKEYS
  // ==========================================

  // Input send ref
  const sendRef = useRef<HTMLSpanElement>(null)

  // Consume chat actions
  const { closeChat } = useContext(MessengerContext)

  useEffect(() => {
    const closeOnEsc = ({ key }: KeyboardEvent) => {
      // Close on esc
      if (key == 'Escape') closeChat()
    }

    window.addEventListener('keyup', closeOnEsc)

    return () => window.removeEventListener('keyup', closeOnEsc)
  }, [chat])

  useEffect(() => {
    if (inputRef.current == undefined) return

    const sendOnEnter = ({ key, shiftKey, target }: KeyboardEvent) => {
      // Send on enter
      if (key == 'Enter' && shiftKey == false) {
        sendRef.current?.click()
        adjustFieldHeight()
      }
    }

    inputRef.current.addEventListener('keyup', sendOnEnter)

    return () => inputRef.current?.removeEventListener('keyup', sendOnEnter)
  }, [inputRef])

  return (
    <div id="chat">
      {/* Peer info */}
      {address && (
        <div className="peer">
          {/* Picture */}
          <ProfilePicture size={40} address={address} />

          {/* Address */}
          <small>{address}</small>
        </div>
      )}

      {/* Messages */}
      <div className="message-scroller" ref={messageScrollerRef}>
        {messages.length > 0 && (
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={message.type}>
                {/* Content */}
                <p>{message.content}</p>

                {/* Timestamp */}
                <small>{getTimestamp(message)}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input panel */}
      <div className="input-panel">
        {/* Input */}
        <textarea
          ref={inputRef}
          placeholder="Write a message"
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          onKeyUp={adjustFieldHeight}
        />

        {/* Send button */}
        <span ref={sendRef} className="send" onClick={sendMessage}>
          <FaPaperPlane />
        </span>
      </div>
    </div>
  )
}
