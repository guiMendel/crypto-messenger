import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { ReactComponent as PendingAnimation } from './pending.svg'
import './style.scss'

export default function SignaturePending({ text }: { text: string }) {
  const { handleLogOut } = useDynamicContext()

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
        <button onClick={handleLogOut}>Sign out</button>
      </div>
    </div>
  )
}
