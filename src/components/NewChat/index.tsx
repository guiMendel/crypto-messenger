import { Client } from '@xmtp/xmtp-js'
import { useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ControlInputContext } from '../../modules/ControlInputContext'
import '../ChatPreview/style.scss'
import ProfilePicture from '../ProfilePicture'
import './style.scss'
import { MessengerContext } from '../../modules/MessengerContext'

export default function NewChat() {
  // Consume input
  const { input, closeInput } = useContext(ControlInputContext)

  // Consume chat control
  const { openChat } = useContext(MessengerContext)

  // Validate input
  const isValid = /^0x[a-fA-F0-9]{40}$/g.test(input)

  // Check if address can receive messages
  const canMessage = isValid && Client.canMessage(input)

  const navigate = useNavigate()

  // Create the new chat and open it
  const createAndOpenChat = async () => {
    if (canMessage == false) return

    // Navigate home
    navigate('/')

    // Open the chat
    openChat(input)

    // Erase input
    closeInput()
  }

  // Request input
  if (input.length === 0)
    return <div id="new-chat">Please provide an address</div>

  // Reject invalid address
  if (isValid == false)
    return <div id="new-chat">Not a valid Ethereum address</div>

  // Reject addresses that can't receive messages
  if (canMessage == false)
    return <div id="new-chat">Can't message this address</div>

  // Preview this new chat
  return (
    <div className="new chat-preview" onClick={createAndOpenChat}>
      {/* Peer's picture */}
      <ProfilePicture address={input} size={40} />

      {/* Conversation details */}
      <div className="text">
        {/* Address */}
        <div className="address">
          <p className="prefix">{input.slice(0, 3)}</p>
          <p>{input.slice(3)}</p>
        </div>

        <small>Start conversation</small>
      </div>
    </div>
  )
}
