import { useEffect, useRef, useState } from 'react'
import './style.scss'
import { FaPaperPlane } from 'react-icons/fa'

export default function Chat({
  address,
  isHidden,
}: {
  address?: string
  isHidden?: boolean
}) {
  // ==========================================
  // === NEW MESSAGE
  // ==========================================

  // Input field ref
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Automatically adjusts height of input field to match content
  function adjustFieldHeight() {
    if (inputRef.current == null) return

    inputRef.current.style.height = '1px'
    inputRef.current.style.height = 15 + inputRef.current.scrollHeight + 'px'
  }

  // Message content
  const [message, setMessage] = useState('')

  // ==========================================
  // === MESSAGE INDEX
  // ==========================================

  // Ref of message scroller
  const messageScrollerRef = useRef<HTMLDivElement>(null)

  // Scroll to end of messages
  useEffect(() => {
    if (messageScrollerRef.current == null || isHidden) return

    // Set scroll to end
    messageScrollerRef.current.scrollTop =
      messageScrollerRef.current.scrollHeight
  }, [messageScrollerRef, isHidden])

  return (
    <div id="chat">
      {/* Messages */}
      <div className="message-scroller" ref={messageScrollerRef}>
        <div className="messages">
          <p className="incoming">Sup brah</p>
          <p className="incoming">Wyd</p>
          <p className="outgoing">not much</p>
          <p className="outgoing">u?</p>
          <p className="incoming">Just checking ya out</p>
          <p className="outgoing">ok</p>
          <p className="incoming">What</p>
          <p className="outgoing">what what</p>
          <p className="incoming">Did you catch last week's episode?</p>
          <p className="outgoing">bad batch?</p>
          <p className="outgoing">hell yeah man. Love wrecker</p>
          <p className="incoming">Don't get too attached to Tech though</p>
          <p className="incoming">Just sayin</p>
          <p className="outgoing">dude come the fuck on</p>
          <p className="outgoing">are u srs right now</p>
          <p className="incoming">Lol</p>
        </div>
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
        <span className="send">
          <FaPaperPlane />
        </span>
      </div>
    </div>
  )
}
