import Profile from '../../components/Profile'
import './style.scss'
import { ReactComponent as EmptyPicture } from './empty.svg'

export default function Chats() {
  return (
    <div id="chats">
      {/* Profile & Chat Select */}
      <main>
        {/* Profile */}
        <Profile />

        {/* Chat Index */}
        <div className="chats">
          <p>Looks like you haven't started any chats yet.</p>

          <EmptyPicture />
        </div>
      </main>
    </div>
  )
}
