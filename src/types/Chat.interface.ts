import { DecodedMessage } from '@xmtp/xmtp-js'

export default interface Chat {
  messages: DecodedMessage[]

  peerAddress: string

  latestMessage?: string
}
