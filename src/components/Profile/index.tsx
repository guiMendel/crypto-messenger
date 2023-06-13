import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react'
import { useEffect } from 'react'
import Jazzicon from 'react-jazzicon'
import './style.scss'

export default function Profile() {
  const { primaryWallet } = useDynamicContext()

  if (primaryWallet == null) return null

  return (
    <div id="profile">
      {/* Profile picture */}
      <Jazzicon
        diameter={70}
        seed={parseInt(primaryWallet.address.slice(2, 10), 16)}
      />

      {/* Dynamic options */}
      <DynamicWidget />
    </div>
  )
}
