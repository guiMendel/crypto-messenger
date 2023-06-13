import './style.scss'

export default function Chat({ address }: { address?: string }) {
  return <div id="chat">
    {/* Messages */}
    <div className="messages"></div>

    {/* Input panel */}
    <div className="input-panel">
      {/* Input */}
      <input type="text" />

      {/* Send button */}
      <span className="send">
        
      </span>
    </div>
  </div>
}
