import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react'
import ProfilePicture from '../ProfilePicture'
import './style.scss'

export default function Profile() {
  const { primaryWallet } = useDynamicContext()

  if (primaryWallet == null) return null

  return (
    <div id="profile">
      {/* Profile picture */}
      <div className="picture">
        <ProfilePicture address={primaryWallet.address} />
      </div>

      {/* Dynamic options */}
      <DynamicWidget />
    </div>
  )
}
