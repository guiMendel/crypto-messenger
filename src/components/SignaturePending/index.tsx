import './style.scss'
import { ReactComponent as PendingAnimation } from './pending.svg'

export default function SignaturePending({ text }: { text: string }) {
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
        {/* <p>We are connecting you to our messenger client...</p> */}
      </div>
    </div>
  )
}
