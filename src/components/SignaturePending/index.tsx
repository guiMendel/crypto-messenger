import './style.scss'
import { ReactComponent as PendingAnimation } from './pending.svg'
import { useMessenger } from '../../modules/useMessenger'

export default function SignaturePending({ text }: { text: string }) {
  const { logout } = useMessenger()

  if (text == '') return null

  return (
    <div id="signature-pending">
      <div className="modal">
        {/* Loading wheel */}
        <PendingAnimation />

        {/* Title */}
        <h2>Signature Requested</h2>

        {/* Text */}
        <p>{text}...</p>

        {/* Log out button */}
        <button onClick={logout}>Sign out</button>
      </div>
    </div>
  )
}
