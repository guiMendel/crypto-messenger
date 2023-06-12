import { DynamicWidget } from '@dynamic-labs/sdk-react'
import { useMessenger } from '../modules/useMessenger'
import { useEffect } from 'react'

function App() {
  const messenger = useMessenger()

  useEffect(() => {
    messenger?.conversations
      .list()
      .then((conversations) => console.log('Conversations:', conversations))
  }, [messenger])

  return (
    <main>
      Hi React!
      <DynamicWidget />
    </main>
  )
}

export default App
