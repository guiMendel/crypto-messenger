import { useContext } from 'react'
import { ControlInputContext } from '../../modules/ControlInputContext'
import '../ChatPreview/style.scss'
import ProfilePicture from '../ProfilePicture'
import './style.scss'

export default function NewChat() {
  // Consume input
  const { input } = useContext(ControlInputContext)

  // Validate input
  const isValid = /^0x[a-fA-F0-9]{40}$/g.test(input)

  // Request input
  if (input.length === 0)
    return <div id="new-chat">Please provide an address</div>

  // Reject invalid address
  if (isValid == false)
    return <div id="new-chat">Not a valid Ethereum address</div>

  // Preview this new chat
  return (
    <div className="new chat-preview">
      {/* Peer's picture */}
      <ProfilePicture address={input} size={40} />

      {/* Conversation details */}
      <div className="text">
        {/* Address */}
        <p>{input}</p>

        <small>Start conversation</small>
      </div>
    </div>
  )
}
